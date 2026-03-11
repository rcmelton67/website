#!/usr/bin/env python3
"""
Quick script to regenerate all tribute pages from data.json
"""
import sys
import os

# Add the tribute-publisher directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tribute_publisher import load_data, rebuild_single_tribute_page, rebuild_archive_pages, rebuild_pet_type_archives, generate_sitemap

def main():
    print("Loading tribute data...")
    entries = load_data()
    
    if not entries:
        print("No tribute entries found in data.json")
        return
    
    print(f"Found {len(entries)} tribute entries")
    print("Regenerating all tribute pages...")
    
    for i, entry in enumerate(entries, 1):
        slug = entry.get("slug", "")
        if slug:
            print(f"[{i}/{len(entries)}] Regenerating: {slug}")
            rebuild_single_tribute_page(entry)
        else:
            print(f"[{i}/{len(entries)}] Skipping entry without slug")
    
    print("Regenerating archive pages...")
    rebuild_archive_pages(entries)
    
    print("Regenerating pet type archives...")
    rebuild_pet_type_archives(entries)
    
    print("Generating sitemap...")
    generate_sitemap(entries)
    
    print(f"\nSuccessfully regenerated {len(entries)} tribute pages!")

if __name__ == "__main__":
    main()
