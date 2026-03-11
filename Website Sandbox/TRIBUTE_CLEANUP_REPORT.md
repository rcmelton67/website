# Legacy Tribute System — Cleanup Report

**Current correct structure:**
- `memorials/pet-tributes/` — archive, data, individual tribute pages
- `templates/tribute-template.html` — tribute body template
- `scripts/tribute_publisher.py` — main tribute generator (Python)
- `scripts/publish_tribute.js` — alternate tribute generator (Node.js)

---

## 1. Legacy Tribute Folders

| Path | Notes |
|------|-------|
| `_internal/tribute_publisher/` | Self-contained legacy publisher (~2191 lines). Uses old paths: `pet-tributes/`, `pet-tributes/memorials/`. Has GUI (tkinter), email, PIL. `PROJECT_ROOT` = its own directory. References `/pet-tributes/assets/mm-tribute.css`. |
| `memorials/pet-tributes/assets/` | Contains legacy CSS/JS no longer referenced. See section 3. |
| `data/pending-tributes/` | Input for tribute scripts. May be empty. Shared by both publishers. |
| `data/published-tributes/` | Contains `test-dog.json`. Output from legacy publish flow. |

---

## 2. Legacy Tribute HTML Pages

| Path | Notes |
|------|-------|
| `memorials/pet-tributes/test-share.html` | Test page for share component. Dev/test only. |
| `memorials/pet-tributes/archive-content.php` | PHP partial for WordPress theme (`page-pet-tributes.php`). Uses `mm-tribute-hero`, `mm-tribute-card`, etc. Different structure than static `index.html` (which uses `mm-archive-card`). Legacy if site is static-only. |

---

## 3. Legacy Tribute CSS or JS

| Path | Notes |
|------|-------|
| `memorials/pet-tributes/assets/mm-tribute.css` | Legacy stylesheet. No current page loads it. All tribute pages use `/assets/css/tribute.css`. |
| `memorials/pet-tributes/assets/mm-tribute.js` | Minimal JS. No HTML file references it. Unused. |
| `memorials/pet-tributes/assets/header-footer.css` | Legacy. Previously for standalone pet-tributes when at project root. Now using global styles. |

**In use (keep):**
- `assets/css/tribute.css` — used by memorials/pet-tributes archive and tribute pages

---

## 4. Legacy Scripts

| Path | Notes |
|------|-------|
| `_internal/tribute_publisher/tribute_publisher.py` | Legacy full-featured publisher. Old paths: `TRIBUTES_DIR = pet-tributes`, `TRIBUTE_CSS_HREF = /pet-tributes/assets/mm-tribute.css`. Uses its own `templates/` under `_internal`. |
| `scripts/publish_tribute.js` | Alternate tribute publisher. Outputs to `pages/memorials/{slug}/` instead of `memorials/pet-tributes/{slug}/`. Uses old template variables (`{{Pet Name}}`, `{{Breed}}`, etc.) vs. new ones (`{{pet_name}}`, `{{breed}}`). Reads from same template but different variable set. |
| `scripts/update_global_navigation.py` | Uses `PET_TRIBUTES_DIR = "pet-tributes"` — path no longer exists (now `memorials/pet-tributes`). Uses `tribute_header.html` and `tribute_footer.html` for tribute pages. Will not find tribute pages with current config. |

---

## 5. Legacy / Alternate Templates

| Path | Notes |
|------|-------|
| `templates/components/tribute_header.html` | Used only by `update_global_navigation.py` for tribute pages. Current tribute system uses `master_header.html`. |
| `templates/components/tribute_footer.html` | Same as above. Current system uses `master_footer.html`. |

---

## 6. Cross-Reference Summary

| Item | Referenced By | Status |
|------|---------------|--------|
| `mm-tribute.css` | _internal/tribute_publisher (old path) | **Legacy** |
| `mm-tribute.js` | None | **Legacy** |
| `header-footer.css` | update_global_navigation (regex replacement only) | **Legacy** |
| `tribute_header.html` | update_global_navigation.py | **Alternate** |
| `tribute_footer.html` | update_global_navigation.py | **Alternate** |
| `archive-content.php` | wp-content page-pet-tributes.php | **WordPress-only** |
| `publish_tribute.js` | No references | **Alternate / legacy** |

---

## 7. Recommendations (for future cleanup)

1. **Remove** `_internal/tribute_publisher/` if the Python sandbox publisher is the only one used.
2. **Remove or update** `scripts/publish_tribute.js` — either align with current structure or delete.
3. **Update** `scripts/update_global_navigation.py` — set `PET_TRIBUTES_DIR = "memorials/pet-tributes"` and decide whether to keep tribute_header/footer or use master_*.
4. **Remove** `memorials/pet-tributes/assets/mm-tribute.css`, `mm-tribute.js`, `header-footer.css` — not referenced.
5. **Evaluate** `templates/components/tribute_header.html` and `tribute_footer.html` — remove if fully replaced by master_*.
6. **Evaluate** `memorials/pet-tributes/archive-content.php` — keep only if WordPress theme is deployed.
7. **Evaluate** `memorials/pet-tributes/test-share.html` — remove or move to a dev/test folder.

---

*Report generated from project scan. No files were deleted.*
