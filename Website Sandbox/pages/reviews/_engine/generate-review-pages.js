/**
 * Review Page Generator
 * 
 * Generates lightweight wrapper pages for dynamic review SEO pages.
 * Pages load the engine bundle and render content dynamically.
 */

const fs = require('fs');
const path = require('path');

// Minimum number of reviews required to generate a page
const MIN_REVIEWS_THRESHOLD = 3;

// Review dataset sources (Node-side; do NOT duplicate review data)
const REVIEWS_JSON_PATHS = [
  path.join(__dirname, '../../../reviews-1.json'),
  path.join(__dirname, '../../../reviews-2.json'),
];

// Page configuration (embedded from review-page-config.js)
const reviewPages = [
  {
    slug: "dog-memorial-stone-reviews",
    title: "Dog Memorial Stone Reviews",
    metaDescription: "Read real customer reviews from families who purchased dog memorial stones. Over 3,700 verified reviews from pet memorial families.",
    filter: ["dog_reviews"],
    category: "clusters",
    intro: "Read real customer reviews from families who purchased dog memorial stones. These handcrafted memorials honor beloved dogs with lasting granite and natural stone tributes.",
    relatedCategories: ["cat-memorial-stone-reviews", "granite-dog-memorial-reviews", "pet-loss-sympathy-gift-reviews"]
  },
  {
    slug: "cat-memorial-stone-reviews",
    title: "Cat Memorial Stone Reviews",
    metaDescription: "Customer reviews from cat memorial stone purchases. Verified reviews from families who honored their cats with handcrafted memorial stones.",
    filter: ["cat_reviews"],
    category: "clusters",
    intro: "Customer reviews from cat memorial stone purchases. Families share their experiences with handcrafted memorial stones designed to honor beloved cats.",
    relatedCategories: ["dog-memorial-stone-reviews", "pet-loss-sympathy-gift-reviews"]
  },
  {
    slug: "granite-dog-memorial-reviews",
    title: "Granite Dog Memorial Reviews",
    metaDescription: "Granite dog memorial stones are one of the most durable outdoor memorial options. Read customer reviews of granite dog memorial stones.",
    filter: ["granite_reviews", "dog_reviews"],
    category: "products",
    intro: "Granite dog memorial stones are one of the most durable outdoor memorial options. Read customer reviews from families who chose granite memorials for their dogs.",
    relatedCategories: ["dog-memorial-stone-reviews", "granite-pet-memorial-reviews", "river-rock-dog-memorial-reviews"]
  },
  {
    slug: "granite-cat-memorial-reviews",
    title: "Granite Cat Memorial Reviews",
    metaDescription: "Read customer reviews of granite cat memorial stones. Durable, handcrafted granite memorials for beloved cats.",
    filter: ["granite_reviews", "cat_reviews"],
    category: "products",
    intro: "Read customer reviews of granite cat memorial stones. These durable, handcrafted granite memorials provide lasting tributes for beloved cats.",
    relatedCategories: ["cat-memorial-stone-reviews", "granite-pet-memorial-reviews"]
  },
  {
    slug: "granite-pet-memorial-reviews",
    title: "Granite Pet Memorial Reviews",
    metaDescription: "Customer reviews of granite pet memorial stones. Durable, engraved granite memorials for all pets.",
    filter: ["granite_reviews"],
    category: "products",
    intro: "Customer reviews of granite pet memorial stones. These durable, engraved granite memorials provide lasting tributes for all types of pets.",
    relatedCategories: ["granite-dog-memorial-reviews", "granite-cat-memorial-reviews", "river-rock-pet-memorial-reviews"]
  },
  {
    slug: "river-rock-dog-memorial-reviews",
    title: "River Rock Dog Memorial Reviews",
    metaDescription: "Read reviews of natural river rock dog memorial stones. Handcrafted natural stone memorials for dogs.",
    filter: ["river_rock_reviews", "dog_reviews"],
    category: "products",
    intro: "Read reviews of natural river rock dog memorial stones. These handcrafted natural stone memorials provide unique, lasting tributes for dogs.",
    relatedCategories: ["dog-memorial-stone-reviews", "river-rock-pet-memorial-reviews"]
  },
  {
    slug: "river-rock-cat-memorial-reviews",
    title: "River Rock Cat Memorial Reviews",
    metaDescription: "Customer reviews of river rock cat memorial stones. Natural stone memorials for beloved cats.",
    filter: ["river_rock_reviews", "cat_reviews"],
    category: "products",
    intro: "Customer reviews of river rock cat memorial stones. These natural stone memorials provide unique, lasting tributes for cats.",
    relatedCategories: ["cat-memorial-stone-reviews", "river-rock-pet-memorial-reviews"]
  },
  {
    slug: "river-rock-pet-memorial-reviews",
    title: "River Rock Pet Memorial Reviews",
    metaDescription: "Read reviews of natural river rock pet memorial stones. Handcrafted natural stone memorials for all pets.",
    filter: ["river_rock_reviews"],
    category: "products",
    intro: "Read reviews of natural river rock pet memorial stones. These handcrafted natural stone memorials provide unique, lasting tributes for all types of pets.",
    relatedCategories: ["river-rock-dog-memorial-reviews", "river-rock-cat-memorial-reviews", "granite-pet-memorial-reviews"]
  },
  {
    slug: "cast-stone-pet-memorial-reviews",
    title: "Cast Stone Pet Memorial Reviews",
    metaDescription: "Customer reviews of cast stone pet memorial stones. Affordable, durable cast stone memorials for pets.",
    filter: ["cast_stone_reviews"],
    category: "products",
    intro: "Customer reviews of cast stone pet memorial stones. These affordable, durable cast stone memorials provide lasting tributes for pets.",
    relatedCategories: ["granite-pet-memorial-reviews", "river-rock-pet-memorial-reviews"]
  },
  {
    slug: "pet-loss-sympathy-gift-reviews",
    title: "Pet Loss Sympathy Gift Reviews",
    metaDescription: "When someone loses a beloved pet, memorial stones are often chosen as thoughtful sympathy gifts. Read real customer reviews from people who purchased these memorial stones as pet loss gifts and sympathy gifts.",
    filter: ["pet_loss_sympathy_gift"],
    category: "pet-loss-gifts",
    intro: "When someone loses a beloved pet, memorial stones are often chosen as thoughtful sympathy gifts. Read real customer reviews from people who purchased these memorial stones as pet loss gifts and sympathy gifts.",
    relatedCategories: ["dog-memorial-stone-reviews", "cat-memorial-stone-reviews"]
  },
  {
    slug: "quality-pet-memorial-reviews",
    title: "Quality Pet Memorial Stone Reviews",
    metaDescription: "Read customer reviews emphasizing the quality and craftsmanship of our handcrafted pet memorial stones.",
    filter: ["quality_reviews"],
    category: "intent",
    intro: "Read customer reviews emphasizing the quality and craftsmanship of our handcrafted pet memorial stones. Families share their experiences with our durable, beautifully engraved memorials.",
    relatedCategories: ["durability-pet-memorial-reviews", "custom-engraving-pet-memorial-reviews"]
  },
  {
    slug: "durability-pet-memorial-reviews",
    title: "Durable Pet Memorial Stone Reviews",
    metaDescription: "Customer reviews highlighting the durability and weather resistance of our pet memorial stones.",
    filter: ["durability_reviews"],
    category: "intent",
    intro: "Customer reviews highlighting the durability and weather resistance of our pet memorial stones. Read how families value lasting memorials that withstand outdoor conditions.",
    relatedCategories: ["quality-pet-memorial-reviews", "granite-pet-memorial-reviews"]
  },
  {
    slug: "custom-engraving-pet-memorial-reviews",
    title: "Custom Engraving Pet Memorial Reviews",
    metaDescription: "Read reviews from families who personalized their pet memorial stones with custom engraving and personal messages.",
    filter: ["custom_engraving_reviews"],
    category: "intent",
    intro: "Read reviews from families who personalized their pet memorial stones with custom engraving and personal messages. See how custom engraving creates meaningful tributes.",
    relatedCategories: ["quality-pet-memorial-reviews", "pet-loss-sympathy-gift-reviews"]
  }
];

// Base directory for reviews pages
const REVIEWS_BASE = path.join(__dirname, '..');

// Web paths (use absolute paths so pages work from any depth)
const ENGINE_WEB_PATH = '/pages/reviews/_engine/review-engine-bundle.js';
const REVIEWS_DATA_WEB_PATH = '/assets/js/reviews-data.js?v=2';
const STYLES_WEB_PATH = '/assets/css/styles.css?v=hardreset3';
const THEME_WEB_PATH = '/assets/css/memorial-theme.css';

// --- Review dataset + filtering (Node-side for generation decisions) ---

function loadAllReviews() {
  const all = [];
  for (const p of REVIEWS_JSON_PATHS) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) all.push(...parsed);
  }
  // Keep only reviews that match the runtime engine expectations
  return all.filter(r => typeof r.star_rating === 'number' && !!r.message && r.star_rating !== 1);
}

const reviewFilters = {
  dog_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const dogKeywords = ['dog', 'puppy', 'pup', 'canine', 'golden retriever', 'lab', 'labrador', 'shepherd', 'dachshund', 'bulldog', 'husky', 'akita', 'pyrenees', 'spaniel'];
    return dogKeywords.some(keyword => msg.includes(keyword));
  },
  cat_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const catKeywords = ['cat', 'kitty', 'kitten', 'feline', 'tabby', 'siamese'];
    return catKeywords.some(keyword => msg.includes(keyword));
  },
  granite_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('granite') || msg.includes('engraved granite');
  },
  river_rock_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('river rock') || msg.includes('natural stone') || msg.includes('rock memorial');
  },
  cast_stone_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('cast stone') || msg.includes('cast-stone');
  },
  pet_loss_gift: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const giftKeywords = ['gift', 'sympathy', 'memorial gift', 'thoughtful gift', 'perfect gift'];
    return giftKeywords.some(keyword => msg.includes(keyword));
  },

  pet_loss_sympathy_gift: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return (
      msg.includes("gift") ||
      msg.includes("sympathy") ||
      msg.includes("memorial gift") ||
      msg.includes("condolence") ||
      msg.includes("sent this")
    );
  },
  quality_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const qualityKeywords = ['quality', 'craftsmanship', 'well made', 'excellent quality', 'beautiful work', 'perfect engraving'];
    return qualityKeywords.some(keyword => msg.includes(keyword));
  },
  durability_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const durabilityKeywords = ['durable', 'lasting', 'last forever', 'weather', 'outdoor', 'permanent'];
    return durabilityKeywords.some(keyword => msg.includes(keyword));
  },
  custom_engraving_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const customKeywords = ['custom', 'personalized', 'engraving', 'engraved', 'personal message'];
    return customKeywords.some(keyword => msg.includes(keyword));
  },
};

function applyFilters(reviews, filterNames) {
  if (!Array.isArray(filterNames) || filterNames.length === 0) return reviews;
  return reviews.filter(review => {
    return filterNames.every(filterName => {
      const fn = reviewFilters[filterName];
      if (!fn) return true;
      return fn(review);
    });
  });
}

function autoMetaDescription(pageConfig) {
  if (pageConfig.metaDescription && pageConfig.metaDescription.trim()) return pageConfig.metaDescription.trim();
  // Basic fallback
  return `Read real customer reviews of ${pageConfig.title.replace('Reviews', '').trim().toLowerCase()} from Melton Memorials. See why families trust our engraved memorial stones to honor beloved pets.`;
}

// Generate breadcrumb HTML
function generateBreadcrumb(pageTitle) {
  return `
  <nav class="breadcrumb container" itemscope itemtype="https://schema.org/BreadcrumbList">
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/pages/home/index.html" itemprop="item">
        <span itemprop="name">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </span>
    &rarr;
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/pages/reviews/index.html" itemprop="item">
        <span itemprop="name">Reviews</span>
      </a>
      <meta itemprop="position" content="2" />
    </span>
    &rarr;
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">${pageTitle}</span>
      <meta itemprop="position" content="3" />
    </span>
  </nav>`;
}

// Generate header HTML
function generateHeader() {
  return `
  <header class="site-header">
    <div class="nav-container">
      <div class="logo">
        <div class="brand">
          <a href="/pages/home/index.html">
            <div class="brand-main">
              <span class="brand-top">MELTON</span>
              <span class="brand-bottom">MEMORIALS</span>
            </div>
            <div class="brand-tagline">
              Love • Honor • Remembrance
            </div>
          </a>
        </div>
      </div>

      <button class="mobile-nav-toggle" aria-label="Toggle navigation">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>

      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle">Memorials</a>
            <ul class="dropdown-menu">
              <li><a href="/pages/products/granite-pet-memorial-stone/index.html">Granite Memorials</a></li>
              <li><a href="/pages/products/cast-stone-pet-memorials/index.html">Cast Stone Memorials</a></li>
              <li><a href="/pages/memorials/river-rock-pet-memorial-stones/index.html">River Rock Memorials</a></li>
            </ul>
          </li>
          <li><a href="/pages/pet-memorial-guides/index.html">Guides</a></li>
          <li><a href="/pages/reviews/index.html">Reviews</a></li>
          <li><a href="/memorials/pet-tributes/">Tributes</a></li>
          <li><a href="/pages/about/index.html">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

// Generate footer HTML
function generateFooter() {
  return `
  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="brand-main">
              <span class="brand-top">MELTON</span>
              <span class="brand-bottom">MEMORIALS</span>
            </div>
            <div class="brand-tagline">Love • Honor • Remembrance</div>
          </div>
          <p class="footer-description">
            Handcrafted pet memorial stones, including granite, cast stone, and natural river rock designs,
            crafted for lasting outdoor placement.
            Each memorial stone is deeply engraved with care in Alma, Arkansas —
            creating a permanent tribute for dogs, cats, and beloved companions.
          </p>
          <div class="footer-rating">★★★★★ <span>Thousands of Five-Star Reviews from Pet Memorial Families</span></div>
        </div>

        <div class="footer-column">
          <h3>Shop</h3>
          <a href="/pages/products/granite-pet-memorial-stone/index.html">Granite Memorials</a>
          <a href="/pages/products/cast-stone-pet-memorial-stones/index.html">Cast Stone Memorials</a>
          <a href="/pages/memorials/river-rock-pet-memorial-stones/index.html">River Rock Memorials</a>
          <a href="/pages/products/heart-shaped-pet-memorial-stone/index.html">Heart Shaped</a>
          <a href="/pages/products/bone-shaped-pet-memorial-stone/index.html">Bone Shaped</a>
          <a href="/pages/products/cat-shaped-pet-memorial-stone/index.html">Cat Shaped</a>
        </div>

        <div class="footer-column">
          <h3>Resources</h3>
          <a href="/pages/pet-memorial-guides/index.html">Memorial Guides</a>
          <a href="/pages/memorials/index.html">Pet Memorial Tributes</a>
          <a href="/pages/reviews/index.html">Customer Reviews</a>
          <a href="/pages/about/index.html">About Us</a>
          <a href="#contact">FAQ</a>
        </div>

        <div class="footer-column">
          <h3>Contact</h3>
          <p class="footer-contact-info">
            <strong>Melton Memorials — Alma, Arkansas</strong><br><br>
            <a href="mailto:rodney@meltonmemorials.com" class="footer-email">rodney@meltonmemorials.com</a><br>
            <a href="tel:+14794300716" class="footer-phone">(479) 430-0716</a>
          </p>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <p>© 2026 Melton Memorials. All rights reserved.</p>
          <div class="footer-legal">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (mobileToggle && mainNav) {
          mobileToggle.addEventListener('click', function () {
            mainNav.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
          });
        }

        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
          toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768 || e.target.closest('.dropdown')) {
              e.preventDefault();
              e.stopPropagation();

              const menu = this.nextElementSibling;
              if (menu) {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
              }
            }
          });
        });

        document.addEventListener('click', function (e) {
          if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => {
              m.style.display = 'none';
            });
          }

          if (mainNav && mainNav.classList.contains('mobile-active') &&
              !e.target.closest('.main-nav') && !e.target.closest('.mobile-nav-toggle')) {
            mainNav.classList.remove('mobile-active');
            mobileToggle.classList.remove('active');
            document.body.classList.toggle('menu-open');
          }
        });
      });
    </script>
  </footer>`;
}

// Generate page HTML
function generatePageHTML(pageConfig) {
  const canonicalUrl = `https://meltonmemorials.com/reviews/${pageConfig.category}/${pageConfig.slug}/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${pageConfig.title} | Melton Memorials</title>
  <meta name="description" content="${autoMetaDescription(pageConfig)}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <link rel="stylesheet" href="${STYLES_WEB_PATH}">
  <link rel="stylesheet" href="${THEME_WEB_PATH}">
  <script src="${REVIEWS_DATA_WEB_PATH}"></script>
</head>
<body>
  ${generateHeader()}
  
  ${generateBreadcrumb(pageConfig.title)}
  
  <main class="container" id="review-root">
    <!-- Content will be injected by review-engine-bundle.js -->
    <h1>${pageConfig.title}</h1>
    <p id="review-intro" class="review-intro">${pageConfig.intro}</p>
    
    <div class="review-summary">
      <div class="rating-score">
        <div class="big-rating" id="average-rating">—</div>
        <div class="total-line">
          Based on <span id="review-count">—</span> verified reviews
        </div>
      </div>

      <div class="rating-bars" id="rating-bars">
        <!-- Rating bars will be rendered by engine -->
      </div>

      <div class="review-insights">
        <h3>Most Mentioned:</h3>
        <div class="review-pills" id="review-pills">
          <!-- Keyword chips will be rendered by engine -->
        </div>
      </div>
    </div>

    <section class="review-mentions" id="most-mentioned-section">
      <h2>Most Mentioned by Customers</h2>
      <div class="review-pills" id="most-mentioned"></div>
    </section>

    <section class="review-grid" id="review-grid">
      <!-- Review cards will be rendered by engine -->
    </section>

    <div id="review-pagination">
      <!-- Pagination will be rendered by engine -->
    </div>

    <section class="review-categories" id="related-reviews">
      <h3>Related Review Pages</h3>
      <ul id="related-links">
        <!-- Related links will be populated by engine -->
      </ul>
    </section>

    <section class="review-conversion-links">
      <div class="mm-review-wrapper">
        <h2>Browse Memorial Stones</h2>
        <p class="review-product-link"><a href="/pages/products/granite-pet-memorial-stone/index.html">Granite Pet Memorial Stones &rarr;</a></p>
        <p class="review-product-link"><a href="/pages/products/river-rock-pet-memorial-stone/index.html">River Rock Pet Memorial Stones &rarr;</a></p>
        <p class="review-product-link"><a href="/pages/products/cast-stone-pet-memorials/index.html">Cast Stone Memorials &rarr;</a></p>
        <p class="review-product-link"><a href="/pages/dog-memorial-stones/index.html">Dog Memorial Stones &rarr;</a></p>
        <p class="review-product-link"><a href="/pages/cat-memorial-stones/index.html">Cat Memorial Stones &rarr;</a></p>
      </div>
    </section>
  </main>

  ${generateFooter()}

  <script src="${ENGINE_WEB_PATH}"></script>
  <script>
    (function() {
      // Extract slug from URL path
      const pathParts = window.location.pathname.split('/').filter(p => p);
      let slug = null;
      let page = 1;

      // Find slug in path (after reviews/)
      const reviewsIndex = pathParts.indexOf('reviews');
      if (reviewsIndex >= 0 && pathParts.length > reviewsIndex + 2) {
        slug = pathParts[reviewsIndex + 2];
      }

      // Check for pagination
      const pageIndex = pathParts.indexOf('page');
      if (pageIndex >= 0 && pathParts.length > pageIndex + 1) {
        page = parseInt(pathParts[pageIndex + 1]) || 1;
      }

      // Wait for reviews and engine to load
      function initPage() {
        if (window.ALL_REVIEWS && window.ALL_REVIEWS.length > 0 && window.ReviewEngine) {
          if (slug) {
            window.ReviewEngine.loadReviewPage(slug, page);
          }
        } else {
          setTimeout(initPage, 100);
        }
      }

      initPage();
    })();
  </script>
</body>
</html>`;
}

// Main generation function
function generatePages() {
  console.log('Generating review pages...\n');

  const allReviews = loadAllReviews();
  console.log(`Loaded ${allReviews.length} valid reviews (excludes 1-star and empty messages)\n`);

  let generatedCount = 0;
  const skipped = [];

  reviewPages.forEach(pageConfig => {
    const categoryDir = path.join(REVIEWS_BASE, pageConfig.category);
    const pageDir = path.join(categoryDir, pageConfig.slug);

    // Apply filters BEFORE generation to avoid thin pages
    const filteredReviews = applyFilters(allReviews, pageConfig.filter);
    if (filteredReviews.length < MIN_REVIEWS_THRESHOLD) {
      console.log(`Skipping ${pageConfig.slug} — ${filteredReviews.length} reviews (threshold: ${MIN_REVIEWS_THRESHOLD})`);
      skipped.push(pageConfig.slug);

      // Remove previously generated page directory if it exists
      if (fs.existsSync(pageDir)) {
        fs.rmSync(pageDir, { recursive: true, force: true });
        console.log(`  Deleted existing directory: ${pageConfig.category}/${pageConfig.slug}/`);
      }
      return;
    }

    // Create directories
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`Created category directory: ${pageConfig.category}/`);
    }

    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Generate index.html
    const html = generatePageHTML(pageConfig);
    const indexPath = path.join(pageDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf8');

    generatedCount++;
    console.log(`✓ Generated: ${pageConfig.category}/${pageConfig.slug}/index.html`);
  });

  // Write skipped pages list (optional future feature)
  const skippedPath = path.join(__dirname, 'skipped-pages.json');
  fs.writeFileSync(skippedPath, JSON.stringify(skipped, null, 2), 'utf8');

  console.log(`\n✅ Generated ${generatedCount} review pages`);
  console.log(`⚠️  Skipped ${skipped.length} pages (saved to _engine/skipped-pages.json)`);
  console.log('\nCategories:');
  const categories = {};
  reviewPages.filter(p => !skipped.includes(p.slug)).forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} pages`);
  });
}

// Run generator
if (require.main === module) {
  generatePages();
}

module.exports = { generatePages, reviewPages };
