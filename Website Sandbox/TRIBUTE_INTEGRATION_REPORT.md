# Tribute System Integration Report

**Date:** March 10, 2026  
**Scope:** Conservative integration of tribute_publisher into Website Sandbox (visual layout preserved)

---

## 1. Files Moved

| From | To |
|------|-----|
| `tribute_publisher/tribute_publisher.py` | `tools/tribute-publisher/tribute_publisher.py` |
| `tribute_publisher/templates/` | `tools/tribute-publisher/templates/` |
| `tribute_publisher/pet-tributes/*` | `memorials/pet-tributes/` (full copy) |

---

## 2. Files Archived to legacy_tribute/

| File | Reason |
|------|--------|
| `robots.txt` | Not used in integrated system |
| `social-share.css` | Styles merged into assets/css/tribute.css |
| `social-share.js` | Standalone share script; tribute uses mm-tribute.js |
| `fbrfg` | Unknown/unused file |

---

## 3. Paths Updated

| Item | Value |
|------|-------|
| Generator output | `C:\Users\rcmel\dev\Website Sandbox\memorials\pet-tributes` |
| Tribute pages | `memorials/pet-tributes/memorials/{slug}/index.html` |
| Archive | `memorials/pet-tributes/index.html` |
| data.json | `memorials/pet-tributes/data.json` |
| Images/assets | `memorials/pet-tributes/images/`, `memorials/pet-tributes/assets/` |
| CSS | `/assets/css/tribute.css` (tribute styles) |
| JS | `/memorials/pet-tributes/assets/mm-tribute.js` |

---

## 4. CSS Migration

| Source | Destination |
|--------|-------------|
| `pet-tributes/assets/mm-tribute.css` | `assets/css/tribute.css` |
| `pet-tributes/assets/header-footer.css` | `assets/css/tribute.css` (merged) |

**No styling rules were changed.** All rules preserved as-is.

---

## 5. Header / Footer Integration

- **Replaced:** Tribute and archive pages now use the site's global header and footer (from `templates/components/master_header.html` and `master_footer.html`).
- **Preserved:** The tribute content block (`<section class="mm-tribute-system">` ... `</section>`) is unchanged.
- **Generator templates:** Updated `tools/tribute-publisher/templates/header.html` and `footer.html` to output the site header/footer so new tributes use them.

---

## 6. Layout Confirmation

**Tribute layout matches original:**
- `.mm-tribute-system`, `.mm-tribute-wrapper`, `.mm-tribute-name`, `.mm-tribute-image`, `.mm-tribute-message`, `.mm-tribute-share`, `.tribute-cta` preserved
- Archive grid, cards (`.mm-archive-card`), pagination, hero, search unchanged
- CSS classes and structure identical to standalone tribute system
- Only header and footer sections were swapped for site navigation

---

## 7. How to Run

```bash
py tools/tribute-publisher/tribute_publisher.py
```

Creates tributes in `memorials/pet-tributes/{slug}/` and updates the archive.

---

## 8. Final Structure

```
Website Sandbox/
├── assets/css/tribute.css       (tribute + archive styles)
├── memorials/pet-tributes/
│   ├── index.html               (archive)
│   ├── data.json
│   ├── assets/                  (mm-tribute.js, images, payment icons)
│   ├── images/
│   ├── memorials/{slug}/        (individual tribute pages)
│   ├── dog/, cat/, page-2/, etc.
│   └── ...
├── tools/tribute-publisher/
│   ├── tribute_publisher.py
│   └── templates/
└── legacy_tribute/
    ├── robots.txt
    ├── social-share.css
    ├── social-share.js
    └── fbrfg
```
