from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import re
import sys
import time
from urllib.parse import urlparse

# Ensure the data directory exists
DATA_DIR = os.path.join(os.getcwd(), 'data', 'pending-tributes')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

class CustomHandler(SimpleHTTPRequestHandler):
    # Canonical review category routes (Phase 1)
    REVIEW_CATEGORIES = {"clusters", "products", "intent", "pet-loss-gifts"}

    # Legacy review slugs that must permanently redirect to the canonical category URL
    LEGACY_REVIEW_REDIRECTS = {
        # clusters
        "dog-memorial-stone-reviews": "/reviews/clusters/dog-memorial-stone-reviews/",
        "cat-memorial-stone-reviews": "/reviews/clusters/cat-memorial-stone-reviews/",

        # products/material
        "granite-pet-memorial-reviews": "/reviews/products/granite-pet-memorial-reviews/",
        "river-rock-pet-memorial-reviews": "/reviews/products/river-rock-pet-memorial-reviews/",

        # gifts
        "pet-loss-sympathy-gift-reviews": "/reviews/pet-loss-gifts/pet-loss-sympathy-gift-reviews/",
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Expires', '0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def _handle_routing(self, req_path: str):
        """
        Returns:
          ("serve", dest_path) to internally rewrite and serve dest_path
          ("redirect", target_url) to 301 redirect
          (None, None) to fall through to static file handling
        """
        # Reviews hub (clean URL)
        if req_path in ("/reviews", "/reviews/"):
            dest = "/pages/reviews/index.html"
            print(f"[reviews-router] serving /reviews/ -> {dest}", flush=True)
            return ("serve", dest)

        # Pillar pages (clean URLs)
        if req_path in ("/pet-memorial-stones", "/pet-memorial-stones/"):
            dest = "/pages/pet-memorial-stones/index.html"
            print(f"[pillar-router] serving /pet-memorial-stones/ -> {dest}", flush=True)
            return ("serve", dest)

        # Clean product URLs:
        # /{slug}/ -> /pages/products/{slug}/index.html (internal rewrite, no redirect)
        # Must not interfere with existing namespaces like /reviews/ or /memorials/
        clean_product_re = re.compile(r"^/([a-z0-9\-]+)/?$")
        m = clean_product_re.match(req_path)
        if m:
            product_slug = m.group(1)
            reserved = {
                "reviews", "pages", "memorials", "assets", "data", "tools", "docs", "templates"
            }
            if product_slug not in reserved:
                fs_path = os.path.join(os.getcwd(), "pages", "products", product_slug, "index.html")
                if os.path.isfile(fs_path):
                    dest = f"/pages/products/{product_slug}/index.html"
                    print(f"[product-router] serving /{product_slug}/ -> {dest}", flush=True)
                    return ("serve", dest)

        # Regex patterns (explicit)
        # ^/reviews/(clusters|products|intent|pet-loss-gifts)/([^/]+)/?$
        # ^/reviews/(clusters|products|intent|pet-loss-gifts)/([^/]+)/page/(\d+)/?$
        paginated_re = re.compile(r"^/reviews/(clusters|products|intent|pet-loss-gifts)/([^/]+)/page/(\d+)/?$")
        normal_re = re.compile(r"^/reviews/(clusters|products|intent|pet-loss-gifts)/([^/]+)/?$")
        legacy_re = re.compile(r"^/reviews/([^/]+)/?$")

        # A) Legacy redirects first
        m = legacy_re.match(req_path)
        if m:
            legacy_slug = m.group(1)
            if legacy_slug in self.LEGACY_REVIEW_REDIRECTS:
                target = self.LEGACY_REVIEW_REDIRECTS[legacy_slug]
                print(f"[reviews-router] legacy redirect matched: {req_path}", flush=True)
                print(f"[reviews-router] redirecting to: {target}", flush=True)
                return ("redirect", target)

        # B) Paginated canonical review routes
        m = paginated_re.match(req_path)
        if m:
            category, slug, page_num = m.group(1), m.group(2), m.group(3)
            dest = f"/pages/reviews/{category}/{slug}/index.html"
            print(f"[reviews-router] paginated route matched: {req_path}", flush=True)
            print(f"[reviews-router] serving: {dest}", flush=True)
            return ("serve", dest)

        # C) Non-paginated canonical review routes
        m = normal_re.match(req_path)
        if m:
            category, slug = m.group(1), m.group(2)
            dest = f"/pages/reviews/{category}/{slug}/index.html"
            print(f"[reviews-router] matched review route: {req_path}", flush=True)
            print(f"[reviews-router] serving wrapper: {dest}", flush=True)
            return ("serve", dest)

        return (None, None)

    def do_HEAD(self):
        parsed = urlparse(self.path)
        req_path = parsed.path
        action, target = self._handle_routing(req_path)
        if action == "redirect":
            self.send_response(301)
            self.send_header("Location", target)
            self.end_headers()
            return
        if action == "serve":
            self.path = target
            return super().do_HEAD()
        return super().do_HEAD()

    def do_GET(self):
        """
        Phase 1: Canonical Reviews routing + legacy redirects.

        Canonical URLs:
          /reviews/                                  -> /pages/reviews/index.html
          /reviews/{category}/{slug}/                -> /pages/reviews/{category}/{slug}/index.html
          /reviews/{category}/{slug}/page/{n}/       -> same wrapper index.html (engine reads page number)

        Legacy redirects (301):
          /reviews/{slug}/ -> /reviews/{category}/{slug}/
        """
        parsed = urlparse(self.path)
        req_path = parsed.path

        action, target = self._handle_routing(req_path)
        if action == "redirect":
            self.send_response(301)
            self.send_header("Location", target)
            self.end_headers()
            return
        if action == "serve":
            self.path = target
            return super().do_GET()

        return super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/submit-tribute':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Create a filename based on timestamp and pet name
                timestamp = int(time.time())
                pet_name = data.get('petName', 'unknown').replace(' ', '_').lower()
                filename = f"{timestamp}_{pet_name}.json"
                filepath = os.path.join(DATA_DIR, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=4)
                
                print(f"Saved tribute to {filepath}")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Tribute saved'}).encode('utf-8'))
                
            except Exception as e:
                print(f"Error saving tribute: {e}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

def run(server_class=HTTPServer, handler_class=CustomHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    print(f"Serving files from {os.getcwd()}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    # Allow overriding port for local testing: `py server.py 8001`
    try:
        port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    except Exception:
        port = 8000
    run(port=port)
