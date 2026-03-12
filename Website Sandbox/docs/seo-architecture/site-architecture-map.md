## Master Site Architecture Map (Website Sandbox rebuild)

This is a **planning/structure** document (not user-facing). It reflects **current reality** in `Website Sandbox/` and separates **built vs planned** so we can avoid keyword overlap and keep internal linking intentional.

### Roles (used throughout)

- **Pillar**: broad topic hub (highest authority)
- **Cluster**: subtopic hub (supports a pillar)
- **Support**: narrower SEO support page
- **Conversion**: commercial/product page
- **Trust**: about/reviews/process/story
- **UGC**: user-generated content (tributes/reviews)
- **Archive**: index/paginated archives
- **Utility**: submit/contact/system pages

### Top-down hierarchy (current + planned)

- **Home** (`/pages/home/index.html`) — **Role**: Pillar, Trust
  - **Pet Memorial Stones (planned pillar)** (`/pet-memorial-stones/`) — **Role**: Pillar
    - **Dog Memorial Stones** (`/pages/dog-memorial-stones/`) — **Role**: Cluster
    - **Cat Memorial Stones** (`/pages/cat-memorial-stones/`) — **Role**: Cluster
    - **Granite Memorial Stones (product pillar)** (`/pages/products/granite-pet-memorial-stone/`) — **Role**: Conversion/Pillar
    - **River Rock Memorial Stones (category)** (`/pages/memorials/river-rock-pet-memorial-stones/`) — **Role**: Cluster
    - **Pet Loss Gift content (planned pillar)** (`/pet-loss-gifts/`) — **Role**: Pillar
    - **Reviews Hub** (`/pages/reviews/index.html`) — **Role**: UGC/Pillar
    - **Tribute Hub** (`/memorials/pet-tributes/`) — **Role**: UGC/Pillar
    - **Memorial Guides (hub)** (`/pages/pet-memorial-guides/`) — **Role**: Support/Cluster

- **Product Pages** — **Role**: Conversion
  - **Granite Pet Memorial Stone** (`/pages/products/granite-pet-memorial-stone/`) — Conversion (primary product)
    - **Builder** (`/pages/products/granite-pet-memorial-stone/create-your-memorial/`) — Utility/Conversion
  - **River Rock Pet Memorial Stone** (`/pages/products/river-rock-pet-memorial-stone/`) — Conversion
    - **Builder** (`/pages/products/river-rock-pet-memorial-stone/create-your-memorial/`) — Utility/Conversion
  - **Cast Stone Pet Memorials (category/product)** (`/pages/products/cast-stone-pet-memorials/`) — Conversion/Cluster
  - **Shape products** — Conversion
    - Bone shaped (`/pages/products/bone-shaped-pet-memorial-stone/`)
    - Heart shaped (`/pages/products/heart-shaped-pet-memorial-stone/`)
    - Cat shaped (`/pages/products/cat-shaped-pet-memorial-stone/`)
    - Cast-stone classic (`/pages/products/cast-stone-classic-pet-memorial-stone/`)
  - **Personalized / custom** — Conversion
    - Custom pet memorial stones (`/pages/custom-pet-memorial-stones/`)

- **Reviews System** — **Role**: UGC + Archive
  - **Main Reviews Hub** (`/pages/reviews/index.html`) — UGC/Pillar
    - **Pagination** (`/pages/reviews/page/{n}/`) — Archive
  - **SEO Review landing pages (dynamic engine)** — Cluster/Support (powered by one dataset)
    - **Engine** (`/pages/reviews/_engine/`) — Utility (source of truth for dynamic wrappers)
    - **Cluster review pages**
      - Dog reviews wrapper (`/pages/reviews/clusters/dog-memorial-stone-reviews/`) — Cluster
      - Cat reviews wrapper (`/pages/reviews/clusters/cat-memorial-stone-reviews/`) — Cluster
    - **Product/material review pages**
      - Granite dog (`/pages/reviews/products/granite-dog-memorial-reviews/`) — Support
      - Granite cat (`/pages/reviews/products/granite-cat-memorial-reviews/`) — Support
      - Granite pet (`/pages/reviews/products/granite-pet-memorial-reviews/`) — Support
      - River rock dog (`/pages/reviews/products/river-rock-dog-memorial-reviews/`) — Support
      - River rock cat (`/pages/reviews/products/river-rock-cat-memorial-reviews/`) — Support
      - River rock pet (`/pages/reviews/products/river-rock-pet-memorial-reviews/`) — Support
      - Cast stone pet (`/pages/reviews/products/cast-stone-pet-memorial-reviews/`) — Support (**currently skipped if <3 reviews**)
    - **Intent review pages**
      - Quality (`/pages/reviews/intent/quality-pet-memorial-reviews/`) — Support
      - Durability (`/pages/reviews/intent/durability-pet-memorial-reviews/`) — Support
      - Custom engraving (`/pages/reviews/intent/custom-engraving-pet-memorial-reviews/`) — Support
    - **Pet loss / sympathy gift review pages**
      - Sympathy gifts (`/pages/reviews/pet-loss-gifts/pet-loss-sympathy-gift-reviews/`) — Support
  - **Review hub/pillars (earlier static pages)** — Trust/UGC
    - Best reviews hub (`/pages/reviews/best-pet-memorial-stone-reviews/`) — Trust/Cluster
    - Pet memorial stone reviews pillar (`/pages/reviews/pet-memorial-stone-reviews/`) — Trust/Cluster
    - Legacy dog/cat/granite/river-rock review pages also exist at `/pages/reviews/{slug}/` (static)

- **Tribute System (static publishing engine)** — **Role**: UGC + Archive
  - **Tribute archive** (`/memorials/pet-tributes/`) — UGC/Pillar
    - **Pet type archives**
      - Dog archive (`/memorials/pet-tributes/dog/`) — Archive/Cluster
      - Cat archive (`/memorials/pet-tributes/cat/`) — Archive/Cluster
    - **Individual tributes** (`/memorials/pet-tributes/{slug}/`) — UGC/Support
    - **Submit tribute** (`/memorials/pet-tributes/submit/`) — Utility
    - **Tribute sitemap** (`/memorials/pet-tributes/sitemap.xml`) — Utility/SEO
  - **Source of truth**: the tribute generator in `tribute_publisher/` (static publishing workflow)

- **Memorial Guides / SEO Content** — **Role**: Support/Cluster
  - **Guides hub** (`/pages/pet-memorial-guides/`) — Cluster
  - **Built guides (examples)**
    - What to write (`/pages/pet-memorial-guides/what-to-write-on-a-pet-memorial-stone/`) — Support (high priority)
    - Granite vs cast stone (`/pages/pet-memorial-guides/granite-vs-cast-stone-pet-memorials/`) — Support
    - Install (`/pages/pet-memorial-guides/how-to-install-a-pet-memorial-stone/`) — Support
    - Maintain (`/pages/pet-memorial-guides/how-to-maintain-a-pet-memorial-stone/`) — Support
    - Choosing size (`/pages/pet-memorial-guides/choosing-the-right-size-pet-memorial-stone/`) — Support
    - What types of pets… (`/pages/pet-memorial-guides/what-types-of-pets-do-you-make-memorial-stones-for/`) — Support

- **Pet Loss Gift Pages** — **Role**: Cluster/Support (needs a true pillar)
  - **Built**: Pet memorial gifts (`/pages/pet-memorial-gifts/`) — Cluster/Conversion-support
  - **Planned**: Pet loss gifts pillar (`/pet-loss-gifts/`) — Pillar
  - **Support**: Pet loss sympathy gift reviews (`/reviews/pet-loss-sympathy-gift-reviews/` target URL; wrapper lives in `/pages/reviews/pet-loss-gifts/...`)

- **About / Trust / Brand Pages** — **Role**: Trust
  - About (`/pages/about/`)
  - Contact (site section / anchors; no dedicated page currently in Sandbox)

## Recommended Next Build Order

1. Finalize dynamic review system (engine + routing + link destinations)
2. Build **Pet Memorial Stones** pillar page (`/pet-memorial-stones/`)
3. Build/upgrade first guide page: **What to Write on a Pet Memorial Stone**
4. Expand internal links from products / reviews / tributes (authority loop)
5. Build pet loss gifts content page (`/pet-loss-gifts/`)
6. Expand tribute filters + related tribute linking (future)

## Simplified ASCII Tree (planning view)

Home
├── /pet-memorial-stones/ (planned)
│   ├── /pages/products/* (conversion)
│   ├── /reviews/ (UGC)
│   ├── /pet-tributes/ (UGC)
│   └── /pages/pet-memorial-guides/ (support)
├── /reviews/
│   ├── dog reviews
│   ├── cat reviews
│   ├── granite reviews
│   ├── river rock reviews
│   └── pet loss sympathy gift reviews
├── /pet-tributes/
│   ├── archive
│   ├── dog/cat archives
│   └── tribute detail pages
└── guides
    ├── what to write
    ├── granite vs cast stone
    └── install / maintain / size

