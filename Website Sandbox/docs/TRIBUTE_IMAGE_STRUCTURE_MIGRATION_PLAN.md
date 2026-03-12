# Tribute Image Structure Migration Plan

## Goal
Move tribute images from centralized `images/` directory into individual tribute folders and update all references.

## Current Structure
- Images: `memorials/pet-tributes/images/{slug}.webp`
- Tribute pages: `memorials/pet-tributes/{slug}/index.html`
- Images referenced as: `/memorials/pet-tributes/images/{filename}`

## Target Structure
- Images: `memorials/pet-tributes/{slug}/{filename}.webp`
- Tribute pages: `memorials/pet-tributes/{slug}/index.html`
- Images referenced as: `{filename}.webp` (local) or `/memorials/pet-tributes/{slug}/{filename}` (absolute)

---

## Step 1: Move Images to Individual Folders

### Files to Process
**Source:** `Website Sandbox/memorials/pet-tributes/images/`
**Target:** `Website Sandbox/memorials/pet-tributes/{slug}/`

### Image Mapping
Based on `data.json`, map each image to its tribute slug:
- `mimi-dog-french-bulldog.webp` → `mimi-dog-french-bulldog/`
- `ryley-dog-english-springer-spaniel.webp` → `ryley-dog-english-springer-spaniel/`
- `ryley-dog-english-springer-spaniel-2.webp` → `ryley-dog-english-springer-spaniel/`
- `phoebe-dog-american-akita.webp` → `phoebe-dog-american-akita/`
- `phoebe-dog-american-akita-2.webp` → `phoebe-dog-american-akita/`
- `missy-dog-rescue-dog.webp` → `missy-dog-rescue-dog/`
- `brownie-dog-mixed-breed.webp` → `brownie-dog-mixed-breed/`
- `brownie-dog-mixed-breed-2.webp` → `brownie-dog-mixed-breed/`
- `lucy-dog-great-pyrenees.webp` → `lucy-dog-great-pyrenees/`
- `woodland-cat.webp` → `woodland-cat/`
- `miss-molly-dachshund-2010-2026.webp` → `miss-molly-dachshund-2010-2026/`
- `miss-molly-dachshund-2010-2026-2.webp` → `miss-molly-dachshund-2010-2026/`
- `kira-siberian-husky-2012-2020.webp` → `kira-siberian-husky-2012-2020/`

### Actions
1. For each image file in `images/`:
   - Extract slug from filename (remove `-2.webp` suffix, etc.)
   - Create tribute folder if it doesn't exist
   - Move image to `{slug}/{filename}`
   - Handle duplicate filenames (e.g., `-2.webp` variants)

### Files to Move
- 21 webp files from `images/` directory
- Create folders as needed

---

## Step 2: Update Tribute HTML Pages

### Files to Update
All `memorials/pet-tributes/*/index.html` files (excluding `cat/`, `dog/`, `submit/`)

### Patterns to Replace

#### Pattern 1: Main Image in `<img>` tag
**From:** `src="/memorials/pet-tributes/images/{filename}"`
**To:** `src="{filename}"`

**Example:**
- From: `<img src="/memorials/pet-tributes/images/woodland-cat.webp" alt="...">`
- To: `<img src="woodland-cat.webp" alt="...">`

#### Pattern 2: Secondary Image
**From:** `src="/memorials/pet-tributes/images/{filename}"`
**To:** `src="{filename}"`

#### Pattern 3: OG Image Meta Tags
**From:** `content="https://meltonmemorials.com/memorials/pet-tributes/images/{filename}"`
**To:** `content="https://meltonmemorials.com/memorials/pet-tributes/{slug}/{filename}"`

**Files:**
- `og:image`
- `og:image:secure_url`
- `twitter:image`
- Schema.org `image` field

#### Pattern 4: Pinterest Share Links
**From:** `&media=https%3A//meltonmemorials.com/memorials/pet-tributes/images/{filename}`
**To:** `&media=https%3A//meltonmemorials.com/memorials/pet-tributes/{slug}/{filename}`

#### Pattern 5: Email Share Links
**From:** `https%3A//meltonmemorials.com/memorials/pet-tributes/images/{filename}`
**To:** `https%3A//meltonmemorials.com/memorials/pet-tributes/{slug}/{filename}`

### Files to Update
- `mimi-dog-french-bulldog/index.html`
- `ryley-dog-english-springer-spaniel/index.html`
- `phoebe-dog-american-akita/index.html`
- `missy-dog-rescue-dog/index.html`
- `brownie-dog-mixed-breed/index.html`
- `lucy-dog-great-pyrenees/index.html`
- `woodland-cat/index.html`
- `miss-molly-dachshund-2010-2026/index.html`
- `kira-siberian-husky-2012-2020/index.html`

---

## Step 3: Update Archive Card Images

### File to Update
`memorials/pet-tributes/index.html`

### Pattern to Replace
**From:** `src="/memorials/pet-tributes/images/{filename}"`
**To:** `src="/memorials/pet-tributes/{slug}/{filename}"`

**Example:**
- From: `<img src="/memorials/pet-tributes/images/phoebe-dog-american-akita.webp" alt="...">`
- To: `<img src="/memorials/pet-tributes/phoebe-dog-american-akita/phoebe-dog-american-akita.webp" alt="...">`

### Also Update Pinterest Links in Cards
**From:** `&media=https%3A//meltonmemorials.com/memorials/pet-tributes/images/{filename}`
**To:** `&media=https%3A//meltonmemorials.com/memorials/pet-tributes/{slug}/{filename}`

---

## Step 4: Update Generator Logic

### File to Update
`tribute_publisher/tribute_publisher.py`

### Changes Required

#### 4.1: Update IMAGE_DIR Constant
**From:**
```python
IMAGE_DIR = os.path.join(TRIBUTE_DIR, "images")
```

**To:**
```python
# Images now stored in individual tribute folders
# IMAGE_DIR is no longer used - images go directly to tribute folders
```

#### 4.2: Update `generate()` Method - Image Copying
**Location:** Around line 2282-2313

**Current:**
```python
img_filename = f"{folder_slug}.webp"
img_dest = os.path.join(IMAGE_DIR, img_filename)
```

**Change to:**
```python
img_filename = f"{folder_slug}.webp"
img_dest = os.path.join(tribute_folder, img_filename)  # Store in tribute folder
```

**Also update:**
- Line 2324: `img2_dest = os.path.join(IMAGE_DIR, img2_filename)` → `os.path.join(tribute_folder, img2_filename)`
- Line 2297: Update `img_abs_url` to use new path structure
- Line 2313: Update placeholder image path

#### 4.3: Update `build_tribute_html()` Function
**Location:** Around line 1143-1184

**Current:**
```python
images_web_path = f"{PET_TRIBUTES_WEB_BASE}/images/"
```

**Change to:**
```python
# Images are now local to each tribute folder
images_web_path = ""  # Empty for local references
# Or use absolute path: f"{PET_TRIBUTES_WEB_BASE}/{slug}/"
```

**Update image path construction:**
- Line 1148: `image_path = f"{images_web_path}{image_filename}"` → `image_path = image_filename` (local) or use absolute path
- Line 1182: Update secondary image path similarly

**Note:** Need to pass `slug` or `tribute_web_path` to `build_tribute_html()` to construct absolute paths for OG tags.

#### 4.4: Update `rebuild_single_tribute_page()` Function
**Location:** Around line 1428-1431

**Current:**
```python
og_image_abs = f"{SITE_DOMAIN}{PET_TRIBUTES_WEB_BASE}/images/{image_filename}"
```

**Change to:**
```python
og_image_abs = f"{SITE_DOMAIN}{PET_TRIBUTES_WEB_BASE}/{slug}/{image_filename}"
```

#### 4.5: Update `build_card_html()` Function
**Location:** Around line 538-541

**Current:**
```python
card_img_src = (
    f"{PET_TRIBUTES_WEB_BASE}/assets/blank_memorial_loving_memory.png"
    if (not image_filename or image_filename == "blank_memorial_loving_memory.png")
    else f"{PET_TRIBUTES_WEB_BASE}/images/{escape_html(image_filename)}"
)
```

**Change to:**
```python
slug = entry.get("slug", "")
card_img_src = (
    f"{PET_TRIBUTES_WEB_BASE}/assets/blank_memorial_loving_memory.png"
    if (not image_filename or image_filename == "blank_memorial_loving_memory.png")
    else f"{PET_TRIBUTES_WEB_BASE}/{slug}/{escape_html(image_filename)}"
)
```

#### 4.6: Remove IMAGE_DIR Usage
- Remove `safe_mkdir(IMAGE_DIR)` calls
- Update any other references to `IMAGE_DIR`

---

## Step 5: Remove Unused Directory

### Action
After confirming all pages work:
- Delete `memorials/pet-tributes/images/` directory
- Keep `memorials/pet-tributes/assets/` (contains placeholders and other assets)

### Verification Before Deletion
1. Test all tribute pages load images correctly
2. Test archive page cards display images
3. Test OG tags work correctly
4. Verify no broken image links

---

## Step 6: Generate Migration Report

### File to Create
`docs/TRIBUTE_IMAGE_STRUCTURE_MIGRATION.md`

### Report Contents
1. **Summary**
   - Images moved: count
   - HTML files updated: count
   - Generator code updated: sections

2. **Images Moved**
   - List each image: `{old_path}` → `{new_path}`

3. **HTML Files Updated**
   - List each tribute page updated
   - List archive page updated
   - Count of pattern replacements per file

4. **Generator Code Changes**
   - List each function/module updated
   - Key changes made

5. **Verification**
   - All images accessible
   - All links working
   - OG tags correct

6. **Files Removed**
   - `memorials/pet-tributes/images/` directory

---

## Implementation Order

1. **Step 1**: Move images (creates new structure)
2. **Step 2**: Update tribute HTML pages (fixes broken image links)
3. **Step 3**: Update archive cards (fixes archive page)
4. **Step 4**: Update generator (ensures future tributes use new structure)
5. **Step 5**: Remove old directory (cleanup)
6. **Step 6**: Generate report (documentation)

---

## Testing Checklist

- [ ] All tribute pages display images correctly
- [ ] Archive page cards display images correctly
- [ ] OG tags point to correct image URLs
- [ ] Pinterest share links work
- [ ] Email share links work
- [ ] Schema.org image fields correct
- [ ] New tribute generation works with new structure
- [ ] No broken image links in browser console
- [ ] All images accessible via direct URL

---

## Notes

- Some images may have `-2.webp` variants (secondary images) - handle these correctly
- Placeholder images remain in `assets/` directory
- Archive cards need absolute paths (from root)
- Tribute pages can use local paths (relative to page)
- OG tags need absolute URLs (full domain + path)
