#!/usr/bin/env python3
"""
Update all paginated review pages (4-64) with:
1. Rating summary section (stars/stats + pills)
2. Fixed search regex (remove word boundaries)
"""

import os
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
REVIEWS_DIR = BASE_DIR / "pages" / "reviews" / "page"

# Rating summary HTML to insert
RATING_SUMMARY_HTML = """        <!-- Rating Summary with Bar Graphs and Pills -->
        <div class="review-summary">
          <div class="rating-score">
            <div class="big-rating">4.98 <span class="stars" style="color: #caa45f;">★★★★★</span></div>
            <div class="total-line">
              Based on <strong>3,700+</strong> Verified Customer Reviews
            </div>
          </div>

          <div class="rating-bars">
            <div class="star-row">
              <div style="color: #caa45f;">★★★★★</div>
              <div class="bar">
                <div class="bar-fill" style="width: 98.6%; background: rgba(0, 0, 0, 0.75);"></div>
              </div>
              <div style="opacity: .7; text-align: right;">3725</div>
            </div>
            <div class="star-row">
              <div style="color: #caa45f;">★★★★</div>
              <div class="bar">
                <div class="bar-fill" style="width: 1.2%; background: rgba(0, 0, 0, 0.75);"></div>
              </div>
              <div style="opacity: .7; text-align: right;">46</div>
            </div>
            <div class="star-row">
              <div style="color: #caa45f;">★★★</div>
              <div class="bar">
                <div class="bar-fill" style="width: 0.1%; background: rgba(0, 0, 0, 0.75);"></div>
              </div>
              <div style="opacity: .7; text-align: right;">3</div>
            </div>
            <div class="star-row">
              <div style="color: #caa45f;">★★</div>
              <div class="bar">
                <div class="bar-fill" style="width: 0.0%; background: rgba(0, 0, 0, 0.75);"></div>
              </div>
              <div style="opacity: .7; text-align: right;">1</div>
            </div>
          </div>

          <div class="review-insights" style="margin-left: 4rem;">
            <h3>Most Mentioned:</h3>
            <div class="review-pills" id="review-pills"></div>
          </div>
        </div>"""

# Pattern to find and replace rating-secondary section
OLD_RATING_SECTION = re.compile(
    r'        <div class="rating-secondary">\s*'
    r'<div class="pills-block">\s*'
    r'<div class="pills-label">Most Mentioned:</div>\s*'
    r'<div class="review-pills" id="review-pills"></div>\s*'
    r'</div>\s*'
    r'</div>',
    re.MULTILINE
)

# Pattern to find and replace search regex
OLD_SEARCH_REGEX = re.compile(
    r"const regex = new RegExp\('\\\\b' \+ escaped \+ '\\\\b', 'i'\);"
)

NEW_SEARCH_REGEX = "const regex = new RegExp(escaped, 'i');"

def update_page(page_num):
    """Update a single review page."""
    page_dir = REVIEWS_DIR / str(page_num)
    index_file = page_dir / "index.html"
    
    if not index_file.exists():
        print(f"  Page {page_num}: File not found, skipping")
        return False
    
    try:
        content = index_file.read_text(encoding='utf-8')
        original_content = content
        
        # Replace rating section
        if OLD_RATING_SECTION.search(content):
            content = OLD_RATING_SECTION.sub(RATING_SUMMARY_HTML, content)
        elif 'review-summary' not in content:
            # Try alternative pattern
            alt_pattern = re.compile(
                r'        <div id="search-status" class="search-status"></div>\s*'
                r'        <div class="rating-secondary">.*?'
                r'        </div>',
                re.DOTALL
            )
            if alt_pattern.search(content):
                content = alt_pattern.sub(
                    f'        <div id="search-status" class="search-status"></div>\n{RATING_SUMMARY_HTML}',
                    content
                )
        
        # Replace search regex
        if OLD_SEARCH_REGEX.search(content):
            content = OLD_SEARCH_REGEX.sub(NEW_SEARCH_REGEX, content)
        elif "new RegExp('\\\\b'" in content:
            # Try alternative pattern
            content = re.sub(
                r"new RegExp\('\\\\b' \+ escaped \+ '\\\\b', 'i'\)",
                "new RegExp(escaped, 'i')",
                content
            )
        
        if content != original_content:
            index_file.write_text(content, encoding='utf-8')
            print(f"  Page {page_num}: Updated ✓")
            return True
        else:
            print(f"  Page {page_num}: No changes needed")
            return False
            
    except Exception as e:
        print(f"  Page {page_num}: Error - {e}")
        return False

def main():
    """Update all pages 4-64."""
    print("Updating review pages 4-64...")
    print("=" * 50)
    
    updated_count = 0
    for page_num in range(4, 65):
        if update_page(page_num):
            updated_count += 1
    
    print("=" * 50)
    print(f"Updated {updated_count} pages")

if __name__ == "__main__":
    main()
