## Page Inventory (current + planned)

Conventions:
- **URL**: shown as the intended web URL (absolute-style)
- **Role**: Pillar / Cluster / Support / Conversion / Trust / UGC / Archive / Utility
- **Tier**: 1 (must-rank) → 4 (utility/niche/future)
- **Status**: built in sandbox / in progress / planned next / future optional

### Existing Pages (built in Sandbox)

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Home | `/pages/home/index.html` | Pillar/Trust | 1 | built in sandbox | pet memorial stones (brand entry) | links out to core nav | Top entry point |
| About | `/pages/about/index.html` | Trust | 3 | built in sandbox | Melton Memorials / about | nav/footer | Add “craftsmanship/process” section later |
| Dog Memorial Stones | `/pages/dog-memorial-stones/index.html` | Cluster | 2 | built in sandbox | dog memorial stones | products, reviews, guides | Category hub |
| Cat Memorial Stones | `/pages/cat-memorial-stones/index.html` | Cluster | 2 | built in sandbox | cat memorial stones | products, reviews, guides | Category hub |
| Custom Pet Memorial Stones | `/pages/custom-pet-memorial-stones/index.html` | Conversion | 2 | built in sandbox | custom pet memorial stones | guides/reviews | Conversion support |
| Pet Memorial Gifts | `/pages/pet-memorial-gifts/index.html` | Cluster/Support | 2 | built in sandbox | pet memorial gifts | products, reviews | This is *not* the full “pet loss gifts” pillar yet |
| Pet Memorial Markers | `/pages/pet-memorial-markers/index.html` | Support/Conversion | 3 | built in sandbox | pet memorial markers | products | Clarify differentiation vs stones |

### Product Pages (built in Sandbox)

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Granite Pet Memorial Stone | `/pages/products/granite-pet-memorial-stone/index.html` | Conversion | 1 | built in sandbox | granite pet memorial stone | reviews, guides, tributes | Primary product |
| Granite Builder | `/pages/products/granite-pet-memorial-stone/create-your-memorial/index.html` | Utility/Conversion | 2 | built in sandbox | custom granite pet memorial stone | product page | Builder UX |
| River Rock Pet Memorial Stone | `/pages/products/river-rock-pet-memorial-stone/index.html` | Conversion | 2 | built in sandbox | river rock pet memorial stone | reviews, guides | Product |
| River Rock Builder | `/pages/products/river-rock-pet-memorial-stone/create-your-memorial/index.html` | Utility/Conversion | 2 | built in sandbox | customize river rock memorial stone | product page | Builder UX |
| Cast Stone Pet Memorials | `/pages/products/cast-stone-pet-memorials/index.html` | Conversion/Cluster | 2 | built in sandbox | cast stone pet memorials | reviews (when available) | Cast stone category |
| Bone Shaped Memorial | `/pages/products/bone-shaped-pet-memorial-stone/index.html` | Conversion | 3 | built in sandbox | bone shaped pet memorial stone | product cluster | Shape SKU |
| Heart Shaped Memorial | `/pages/products/heart-shaped-pet-memorial-stone/index.html` | Conversion | 3 | built in sandbox | heart shaped pet memorial stone | product cluster | Shape SKU |
| Cat Shaped Memorial | `/pages/products/cat-shaped-pet-memorial-stone/index.html` | Conversion | 3 | built in sandbox | cat shaped pet memorial stone | product cluster | Shape SKU |
| Cast Stone Classic | `/pages/products/cast-stone-classic-pet-memorial-stone/index.html` | Conversion | 3 | built in sandbox | cast stone memorial stone | product cluster | SKU page |

### Memorial Category Pages (built in Sandbox)

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Memorials hub | `/pages/memorials/index.html` | Cluster | 2 | built in sandbox | pet memorial tributes / memorials | tributes, products | Category hub |
| River Rock Memorial Stones (category) | `/pages/memorials/river-rock-pet-memorial-stones/index.html` | Cluster | 2 | built in sandbox | river rock pet memorial stones | river rock product + reviews | Category listing page |

### Guides / SEO Content (built in Sandbox)

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Guides hub | `/pages/pet-memorial-guides/index.html` | Cluster | 2 | built in sandbox | pet memorial guides | guides + products | Navigation hub |
| What to write | `/pages/pet-memorial-guides/what-to-write-on-a-pet-memorial-stone/index.html` | Support | 2 | built in sandbox | what to write on a pet memorial stone | product + reviews | High-value informational |
| Granite vs cast stone | `/pages/pet-memorial-guides/granite-vs-cast-stone-pet-memorials/index.html` | Support | 3 | built in sandbox | granite vs cast stone pet memorial | products | Comparison guide |
| Install guide | `/pages/pet-memorial-guides/how-to-install-a-pet-memorial-stone/index.html` | Support | 3 | built in sandbox | how to install a pet memorial stone | products | Support content |
| Maintain guide | `/pages/pet-memorial-guides/how-to-maintain-a-pet-memorial-stone/index.html` | Support | 3 | built in sandbox | maintain a pet memorial stone | products | Support content |
| Choosing size | `/pages/pet-memorial-guides/choosing-the-right-size-pet-memorial-stone/index.html` | Support | 3 | built in sandbox | pet memorial stone size | products | Support content |
| What types of pets | `/pages/pet-memorial-guides/what-types-of-pets-do-you-make-memorial-stones-for/index.html` | Support | 3 | built in sandbox | what pets memorial stones | products | FAQ-style guide |
| What types of pets (variant) | `/pages/pet-memorial-guides/what-types-of-pets-memorial-stones/index.html` | Support | 4 | built in sandbox | what types of pets memorial stones | guides hub | Potential cannibalization with prior page |

### Reviews System (built in Sandbox)

Notes:
- Review **cards + pagination** currently exist as static HTML pages under `/pages/reviews/` and `/pages/reviews/page/{n}/`.
- Dynamic SEO wrappers are powered by the review engine in `/pages/reviews/_engine/`.

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Reviews hub | `/pages/reviews/index.html` | UGC/Pillar | 1 | built in sandbox | pet memorial stone reviews | products, guides, review clusters | Main review entry |
| Reviews pagination | `/pages/reviews/page/{n}/index.html` | Archive | 3 | built in sandbox | (long tail) | hub | Keep lightweight |
| Dog review wrapper | `/pages/reviews/clusters/dog-memorial-stone-reviews/index.html` | Cluster | 2 | built in sandbox | dog memorial stone reviews | products, guides, related reviews | Engine-rendered |
| Cat review wrapper | `/pages/reviews/clusters/cat-memorial-stone-reviews/index.html` | Cluster | 2 | built in sandbox | cat memorial stone reviews | products, guides, related reviews | Engine-rendered |
| Granite dog reviews | `/pages/reviews/products/granite-dog-memorial-reviews/index.html` | Support | 3 | built in sandbox | granite dog memorial reviews | granite product + dog cluster | Engine-rendered |
| Granite cat reviews | `/pages/reviews/products/granite-cat-memorial-reviews/index.html` | Support | 3 | built in sandbox | granite cat memorial reviews | granite product + cat cluster | Engine-rendered |
| Granite pet reviews | `/pages/reviews/products/granite-pet-memorial-reviews/index.html` | Support | 3 | built in sandbox | granite memorial reviews | granite product | Engine-rendered |
| River rock dog reviews | `/pages/reviews/products/river-rock-dog-memorial-reviews/index.html` | Support | 3 | built in sandbox | river rock dog memorial reviews | river rock product | Engine-rendered |
| River rock cat reviews | `/pages/reviews/products/river-rock-cat-memorial-reviews/index.html` | Support | 3 | built in sandbox | river rock cat memorial reviews | river rock product | Engine-rendered |
| River rock pet reviews | `/pages/reviews/products/river-rock-pet-memorial-reviews/index.html` | Support | 3 | built in sandbox | river rock memorial reviews | river rock product | Engine-rendered |
| Pet loss sympathy gift reviews | `/pages/reviews/pet-loss-gifts/pet-loss-sympathy-gift-reviews/index.html` | Support | 2 | built in sandbox | pet loss gift reviews / pet sympathy gift reviews | gifts pillar (planned) + products | Engine-rendered |
| Quality intent reviews | `/pages/reviews/intent/quality-pet-memorial-reviews/index.html` | Support | 3 | built in sandbox | quality pet memorial reviews | products | Engine-rendered |
| Durability intent reviews | `/pages/reviews/intent/durability-pet-memorial-reviews/index.html` | Support | 4 | built in sandbox | durable pet memorial stone reviews | products | Engine-rendered |
| Custom engraving intent reviews | `/pages/reviews/intent/custom-engraving-pet-memorial-reviews/index.html` | Support | 4 | built in sandbox | custom engraving reviews | builder pages | Engine-rendered |

### Tribute System (built in Sandbox)

Important: the tribute system is a **static publishing engine**; the generator is the source of truth.

| Page name | URL | Role | Tier | Status | Primary keyword target | Links to / linked from | Notes |
|---|---|---:|---:|---|---|---|---|
| Tribute archive | `/memorials/pet-tributes/` | UGC/Pillar | 1 | built in sandbox | pet memorial tributes | products, guides, reviews | Archive + cards |
| Tribute pagination | `/memorials/pet-tributes/page/{n}/` | Archive | 3 | planned/future | (long tail) | archive | Not present yet in Sandbox structure |
| Dog tribute archive | `/memorials/pet-tributes/dog/` | Archive/Cluster | 2 | built in sandbox | dog memorial tribute | archive | Category archive |
| Cat tribute archive | `/memorials/pet-tributes/cat/` | Archive/Cluster | 2 | built in sandbox | cat memorial tribute | archive | Category archive |
| Tribute submit | `/memorials/pet-tributes/submit/` | Utility | 3 | built in sandbox | submit pet tribute | archive | Utility |
| Tribute detail pages | `/memorials/pet-tributes/{slug}/` | UGC/Support | 3 | built in sandbox | pet memorial tribute example | archive + products | Many slugs |

## Built in Sandbox (but should be reconciled)

- **Reviews “static pillar/hub” pages** exist at `/pages/reviews/{slug}/` (e.g., `dog-memorial-stone-reviews/`, `granite-pet-memorial-reviews/`) *and* dynamic wrappers also exist under `/pages/reviews/{category}/{slug}/`.
  - **Recommendation**: choose one canonical URL strategy for “/reviews/{slug}/” vs “/pages/reviews/...”.

## In Progress

- Review engine routing + canonical URL alignment (wrappers use canonical `https://meltonmemorials.com/reviews/{slug}/`)
- Avoid duplicate review hubs/pillars (decide what stays)

## Planned Next (practical roadmap)

- `/pet-memorial-stones/` — **Pillar** (Tier 1)
- `/pet-loss-gifts/` — **Pillar** (Tier 2)
- `/pages/pet-memorial-guides/pet-memorial-sayings/` — **Support** (Tier 3)
- `/pages/pet-memorial-guides/pet-memorial-ideas/` — **Support** (Tier 3)
- `/pages/pet-memorial-guides/dog-memorial-ideas/` — **Support** (Tier 3)
- `/pages/pet-memorial-guides/cat-memorial-ideas/` — **Support** (Tier 3)

## Future / Optional

- Tribute filters by breed/type (new archives)
- Intent-based product landing pages (avoid overlap with review intent pages)
- Consolidate “what types of pets…” guide variants to prevent cannibalization

