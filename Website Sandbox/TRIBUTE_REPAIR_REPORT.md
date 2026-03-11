# Tribute System Repair Report

**Date:** March 10, 2026  
**Scope:** Path and duplicate data repairs (no layout or CSS changes)

---

## Files Modified

| File | Changes |
|------|---------|
| `tools/tribute-publisher/tribute_publisher.py` | Updated get_entry_web_base, find_tribute_folder, build_card_html, image paths, pagination, sitemap, og_image, favicon, tribute_web_path, generate() image output to IMAGES_DIR |
| `tools/tribute-publisher/templates/archive.html` | Replaced /pet-tributes/ with /memorials/pet-tributes/ |
| `memorials/pet-tributes/data.json` | Removed "folder" field from all entries |
| `memorials/pet-tributes/index.html` | URL and image path replacements |
| `memorials/pet-tributes/dog/index.html` | URL and image path replacements |
| `memorials/pet-tributes/cat/index.html` | URL and image path replacements |
| `memorials/pet-tributes/*/index.html` (9 tribute pages) | URL and image path replacements |
| `memorials/pet-tributes/archive-content.php` | Submit link updated |

---

## Duplicate Entries Removed

**None.** `data.json` had 9 unique slugs (kira, miss-molly, woodland, phoebe, lucy, brownie, missy, mimi, ryley). No duplicate slugs were present. The "folder" field was removed from all entries.

---

## Paths Corrected

| Item | Before | After |
|------|--------|-------|
| Tribute URL | `/pet-tributes/memorials/{slug}/` | `/memorials/pet-tributes/{slug}/` |
| Archive URL | `/pet-tributes/` | `/memorials/pet-tributes/` |
| Image paths | `/pet-tributes/memorials/{slug}/{filename}` | `/memorials/pet-tributes/images/{filename}` |
| Tribute folder structure | `memorials/pet-tributes/memorials/{slug}/` | `memorials/pet-tributes/{slug}/` |
| IMAGES_DIR | (per-tribute) | `memorials/pet-tributes/images/` |
| Generator output | TRIBUTES_DIR | `C:\...\memorials\pet-tributes` |

---

## Tribute Layout and CSS

**No changes.** Tribute HTML structure (`.mm-tribute-system`, `.mm-tribute-wrapper`, etc.) and CSS styling remain unchanged. Only paths and URLs were updated.

---

## Verification

- Tribute images copied to `memorials/pet-tributes/images/`
- Placeholder copied to `memorials/pet-tributes/images/blank_memorial_loving_memory.png`
- Tribute folders moved from `memorials/pet-tributes/memorials/{slug}/` to `memorials/pet-tributes/{slug}/`
- Empty `memorials/` subfolder removed
