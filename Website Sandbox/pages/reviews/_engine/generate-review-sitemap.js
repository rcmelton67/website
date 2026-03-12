/**
 * Review Sitemap Generator
 * 
 * Generates sitemap.xml for all dynamic review pages.
 */

const fs = require('fs');
const path = require('path');

// Import page config from generator
const { reviewPages } = require('./generate-review-pages.js');

// Minimum number of reviews required to include a page in sitemap
const MIN_REVIEWS_THRESHOLD = 3;

// Review dataset sources (Node-side; do NOT duplicate review data)
const REVIEWS_JSON_PATHS = [
  path.join(__dirname, '../../../reviews-1.json'),
  path.join(__dirname, '../../../reviews-2.json'),
];

// Sitemap configuration
const SITE_DOMAIN = 'https://meltonmemorials.com';
const SITEMAP_OUTPUT = path.join(__dirname, '../../sitemap-reviews.xml');
const CHANGE_FREQ = 'weekly';
const PRIORITY = '0.8';

function loadAllReviews() {
  const all = [];
  for (const p of REVIEWS_JSON_PATHS) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) all.push(...parsed);
  }
  return all.filter(r => typeof r.star_rating === 'number' && !!r.message && r.star_rating !== 1);
}

// Keep filter logic in sync with the engine / page generator
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

// Generate sitemap XML
function generateSitemap() {
  const allReviews = loadAllReviews();
  const includedPages = reviewPages.filter(page => {
    const filtered = applyFilters(allReviews, page.filter);
    return filtered.length >= MIN_REVIEWS_THRESHOLD;
  });

  const urls = includedPages.map(page => {
    const url = `${SITE_DOMAIN}/reviews/${page.category}/${page.slug}/`;
    return `  <url>
    <loc>${url}</loc>
    <changefreq>${CHANGE_FREQ}</changefreq>
    <priority>${PRIORITY}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return sitemap;
}

// Write sitemap file
function writeSitemap() {
  const sitemap = generateSitemap();
  fs.writeFileSync(SITEMAP_OUTPUT, sitemap, 'utf8');
  console.log(`✅ Generated sitemap: ${SITEMAP_OUTPUT}`);
  console.log(`   Included dynamic review pages meeting threshold (${MIN_REVIEWS_THRESHOLD}+ reviews)\n`);
  
  console.log('Pages included:');
  // Log included pages
  const allReviews = loadAllReviews();
  reviewPages.forEach(page => {
    const filtered = applyFilters(allReviews, page.filter);
    if (filtered.length >= MIN_REVIEWS_THRESHOLD) {
      console.log(`  - /reviews/${page.slug}/ (${filtered.length} reviews)`);
    } else {
      console.log(`  - Skipping /reviews/${page.slug}/ — ${filtered.length} reviews`);
    }
  });
}

// Run generator
if (require.main === module) {
  writeSitemap();
}

module.exports = { generateSitemap, writeSitemap };
