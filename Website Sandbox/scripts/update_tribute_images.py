#!/usr/bin/env python3
"""
Update tribute HTML files to use new image structure.
Moves from /memorials/pet-tributes/images/ to local references.
"""
import os
import re
import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
TRIBUTES_DIR = BASE_DIR / "memorials" / "pet-tributes"
DATA_JSON = TRIBUTES_DIR / "data.json"

# Load tribute data
with open(DATA_JSON, 'r', encoding='utf-8') as f:
    tributes = json.load(f)

# Create slug to image mapping
slug_to_images = {}
for tribute in tributes:
    slug = tribute.get('slug', '')
    if slug:
        images = []
        if tribute.get('image_filename'):
            images.append(tribute['image_filename'])
        if tribute.get('image2_filename'):
            images.append(tribute['image2_filename'])
        slug_to_images[slug] = images

# Process each tribute
for tribute in tributes:
    slug = tribute.get('slug', '')
    if not slug:
        continue
    
    html_path = TRIBUTES_DIR / slug / "index.html"
    if not html_path.exists():
        print(f"Skipping {slug} - no index.html")
        continue
    
    print(f"Processing {slug}...")
    
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Get image filenames for this tribute
    images = slug_to_images.get(slug, [])
    main_image = images[0] if images else None
    secondary_image = images[1] if len(images) > 1 else None
    
    # Update OG image tags
    if main_image:
        old_og_path = f"/memorials/pet-tributes/images/{main_image}"
        new_og_path = f"/memorials/pet-tributes/{slug}/{main_image}"
        
        # Update og:image
        content = re.sub(
            rf'<meta property="og:image" content="https://meltonmemorials\.com{re.escape(old_og_path)}">',
            f'<meta property="og:image" content="https://meltonmemorials.com{new_og_path}">',
            content
        )
        
        # Update og:image:secure_url
        content = re.sub(
            rf'<meta property="og:image:secure_url" content="https://meltonmemorials\.com{re.escape(old_og_path)}">',
            f'<meta property="og:image:secure_url" content="https://meltonmemorials.com{new_og_path}">',
            content
        )
        
        # Update twitter:image
        content = re.sub(
            rf'<meta name="twitter:image" content="https://meltonmemorials\.com{re.escape(old_og_path)}">',
            f'<meta name="twitter:image" content="https://meltonmemorials.com{new_og_path}">',
            content
        )
        
        # Update schema.org image in JSON
        content = re.sub(
            rf'"image":\s*"https://meltonmemorials\.com{re.escape(old_og_path)}"',
            f'"image": "https://meltonmemorials.com{new_og_path}"',
            content
        )
    
    # Update main image src (local reference)
    if main_image:
        old_img_src = f'src="/memorials/pet-tributes/images/{main_image}"'
        # Extract existing alt and add performance attributes
        img_match = re.search(rf'<img {re.escape(old_img_src)}([^>]*)>', content)
        if img_match:
            attrs = img_match.group(1)
            # Get width/height from OG tags if available
            width_match = re.search(r'<meta property="og:image:width" content="(\d+)">', content)
            height_match = re.search(r'<meta property="og:image:height" content="(\d+)">', content)
            width = width_match.group(1) if width_match else "800"
            height = height_match.group(1) if height_match else "600"
            
            new_img = f'<img src="{main_image}"{attrs} loading="lazy" width="{width}" height="{height}">'
            content = re.sub(rf'<img {re.escape(old_img_src)}[^>]*>', new_img, content)
    
    # Update secondary image src (local reference)
    if secondary_image:
        old_img2_src = f'src="/memorials/pet-tributes/images/{secondary_image}"'
        img2_match = re.search(rf'<img {re.escape(old_img2_src)}([^>]*)>', content)
        if img2_match:
            attrs = img2_match.group(1)
            new_img2 = f'<img src="{secondary_image}"{attrs} loading="lazy" width="800" height="600">'
            content = re.sub(rf'<img {re.escape(old_img2_src)}[^>]*>', new_img2, content)
    
    # Update Pinterest share links
    if main_image:
        old_pinterest_path = f"https%3A//meltonmemorials.com/memorials/pet-tributes/images/{main_image}"
        new_pinterest_path = f"https%3A//meltonmemorials.com/memorials/pet-tributes/{slug}/{main_image}"
        content = content.replace(old_pinterest_path, new_pinterest_path)
    
    # Update email share links
    if main_image:
        old_email_path = f"https%3A//meltonmemorials.com/memorials/pet-tributes/images/{main_image}"
        new_email_path = f"https%3A//meltonmemorials.com/memorials/pet-tributes/{slug}/{main_image}"
        content = content.replace(old_email_path, new_email_path)
    
    # Add SEO product link section if not present
    if 'tribute-memorial-product' not in content:
        footer_match = re.search(r'(</section>\s*</main>\s*<footer)', content)
        if footer_match:
            seo_section = '''</section>

<section class="tribute-memorial-product">
  <h2>Create a Memorial Like This</h2>
  <p>
    This tribute was created with a handcrafted engraved memorial stone.
    If you would like to create a lasting memorial for your own pet,
    you can view our handcrafted memorial stones below.
  </p>
  <p>
    <a href="/pages/products/granite-pet-memorial-stone/">
      View Granite Pet Memorial Stones →
    </a>
  </p>
</section>
</main>
<footer'''
            content = re.sub(r'</section>\s*</main>\s*<footer', seo_section, content)
    
    # Write updated content
    if content != original_content:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {slug}")
    else:
        print(f"  - No changes needed for {slug}")

print("\nDone!")
