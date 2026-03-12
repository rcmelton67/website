## Keyword Cluster Map (ownership + cannibalization guardrails)

This map is organized by **keyword cluster** (not by page). For each cluster, we assign a **primary owner page** and supporting pages. The goal is to avoid cannibalization while strengthening the authority loop (products ↔ reviews ↔ tributes ↔ guides).

### Roles reminder

- **Primary Owner**: the page that should rank for the head term
- **Supporting Pages**: related pages that link up to the owner (and each other sparingly)

## Core Commercial Cluster

**Keywords**
- pet memorial stone / pet memorial stones
- pet headstone
- engraved pet memorial stone

**Primary Owner (planned)**
- `/pet-memorial-stones/` (Pillar)

**Supporting Pages (built)**
- `/pages/products/granite-pet-memorial-stone/` (Conversion)
- `/pages/products/river-rock-pet-memorial-stone/` (Conversion)
- `/pages/products/cast-stone-pet-memorials/` (Conversion/Cluster)
- `/pages/custom-pet-memorial-stones/` (Conversion)
- `/pages/dog-memorial-stones/` (Cluster)
- `/pages/cat-memorial-stones/` (Cluster)

**Cannibalization risks**
- If `/pages/products/granite-pet-memorial-stone/` tries to target “pet memorial stones” too aggressively, it can compete with `/pet-memorial-stones/`.

**Recommendation**
- Keep the planned pillar as the head-term owner; products focus on **material/shape** intent.

## Reviews Cluster

**Keywords**
- pet memorial stone reviews
- dog memorial stone reviews
- cat memorial stone reviews
- granite memorial reviews
- river rock memorial reviews
- pet loss gift reviews / pet sympathy gift reviews

**Primary Owner**
- `/pages/reviews/` (UGC/Pillar)

**Supporting Pages (engine wrappers; built)**
- `/reviews/dog-memorial-stone-reviews/` (canonical intent; wrapper lives at `/pages/reviews/clusters/dog-memorial-stone-reviews/`)
- `/reviews/cat-memorial-stone-reviews/`
- `/reviews/granite-pet-memorial-reviews/`
- `/reviews/river-rock-pet-memorial-reviews/`
- `/reviews/pet-loss-sympathy-gift-reviews/`

**Cannibalization risks**
- Duplicate “pillar” review pages exist both as older static pages under `/pages/reviews/{slug}/` and as dynamic wrapper pages under `/pages/reviews/{category}/{slug}/`.

**Recommendation**
- Decide one canonical URL strategy for each review slug (prefer `/reviews/{slug}/` long-term, with wrappers as the implementation).

## Tribute Cluster (UGC + emotional intent)

**Keywords**
- pet memorial tribute
- dog memorial tribute
- cat memorial tribute
- pet tribute example
- in memory of my dog / in memory of my cat (long tail)

**Primary Owner**
- `/memorials/pet-tributes/` (UGC/Pillar)

**Supporting Pages (built)**
- `/memorials/pet-tributes/dog/` (Archive/Cluster)
- `/memorials/pet-tributes/cat/` (Archive/Cluster)
- `/memorials/pet-tributes/{slug}/` (UGC/Support)

**Cannibalization risks**
- Breed-specific future archives could overlap with pet-type archives (dog/cat) if not carefully scoped.

**Recommendation**
- If adding breed pages, scope them under dog/cat (e.g., `/pet-tributes/dog/golden-retriever/`) and keep internal linking light.

## Pet Loss Gift Cluster

**Keywords**
- pet loss gift
- pet sympathy gift
- memorial gift for pet loss
- condolence gift for pet loss

**Primary Owner (planned)**
- `/pet-loss-gifts/` (Pillar)

**Supporting Pages (built)**
- `/pages/pet-memorial-gifts/` (Support/Cluster)
- `/reviews/pet-loss-sympathy-gift-reviews/` (Support; wrapper under `/pages/reviews/pet-loss-gifts/...`)

**Cannibalization risks**
- “Pet memorial gifts” page + “pet loss gifts” planned pillar + “pet loss gift reviews” can overlap if all target the same head term.

**Recommendation**
- Use `/pet-loss-gifts/` as head-term owner; “gifts” page can be a shopping-style cluster; reviews page is support and should link up.

## Guide / Informational Cluster

**Keywords**
- what to write on a pet memorial stone
- pet memorial sayings
- pet memorial ideas
- dog memorial ideas
- cat memorial ideas

**Primary Owner**
- For “what to write…”: `/pages/pet-memorial-guides/what-to-write-on-a-pet-memorial-stone/` (Support, Tier 2)

**Supporting Pages**
- `/pages/pet-memorial-guides/` (Guides hub)
- Planned: `/pages/pet-memorial-guides/pet-memorial-sayings/`
- Planned: `/pages/pet-memorial-guides/pet-memorial-ideas/`
- Planned: `/pages/pet-memorial-guides/dog-memorial-ideas/`
- Planned: `/pages/pet-memorial-guides/cat-memorial-ideas/`

**Cannibalization risks**
- Two existing “what types of pets…” guides are very similar:
  - `/pages/pet-memorial-guides/what-types-of-pets-do-you-make-memorial-stones-for/`
  - `/pages/pet-memorial-guides/what-types-of-pets-memorial-stones/`

**Recommendation**
- Pick one canonical owner and down-scope or merge the other to prevent competing for the same terms.

