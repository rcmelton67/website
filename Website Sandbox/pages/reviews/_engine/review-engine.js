/**
 * Review Engine Controller
 * 
 * Main controller for dynamic SEO review pages.
 * Handles filtering, pagination, summary calculation, and rendering.
 */

import { reviewFilters } from './review-filters.js';
import { reviewPages } from './review-page-config.js';
import { 
  calculateSummary, 
  paginateReviews, 
  generatePaginationHTML,
  formatDate,
  extractKeywords
} from './review-utils.js';

/**
 * Load all reviews from the global reviews data
 * @returns {Array} Array of all reviews
 */
export function loadReviews() {
  if (!window.ALL_REVIEWS) {
    console.error('Review data not loaded. Ensure reviews-data.js is included.');
    return [];
  }
  return window.ALL_REVIEWS;
}

/**
 * Apply filter presets to reviews
 * @param {Array} reviews - Review array
 * @param {Array} filterNames - Array of filter function names
 * @returns {Array} Filtered review array
 */
export function applyFilters(reviews, filterNames) {
  if (!Array.isArray(filterNames) || filterNames.length === 0) {
    return reviews;
  }

  return reviews.filter(review => {
    // Exclude 1-star reviews per spec
    if (review.star_rating === 1) return false;
    if (!review.message) return false;

    // Apply all filters (AND logic)
    return filterNames.every(filterName => {
      const filterFn = reviewFilters[filterName];
      if (!filterFn) {
        console.warn(`Filter "${filterName}" not found`);
        return true; // Don't exclude if filter doesn't exist
      }
      return filterFn(review);
    });
  });
}

/**
 * Render review cards (reuses existing card rendering logic)
 * @param {Array} reviews - Review array to render
 * @param {HTMLElement} container - Container element to append cards to
 */
export function renderReviewCards(reviews, container) {
  if (!container) {
    console.error('Container element not found');
    return;
  }

  container.innerHTML = "";

  if (reviews.length === 0) {
    const empty = document.createElement("div");
    empty.style.opacity = "0.7";
    empty.style.marginTop = "2rem";
    empty.style.textAlign = "center";
    empty.textContent = "No reviews found for this filter.";
    container.appendChild(empty);
    return;
  }

  reviews.forEach(review => {
    const card = document.createElement("article");
    card.className = "review-card";

    const stars = "★".repeat(review.star_rating || 0);

    card.innerHTML = `
      <div class="review-stars">${stars}</div>
      <p class="review-text">${review.message}</p>
      <div class="review-meta">
        <span class="review-author">${review.reviewer || ""}</span>
        <span class="review-date">${formatDate(review.date_reviewed)}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Render rating distribution bars
 * @param {Object} summary - Summary object from calculateSummary
 * @param {HTMLElement} container - Container element
 */
export function renderRatingBars(summary, container) {
  if (!container) return;

  container.innerHTML = "";

  const { ratingDistribution, reviewCount } = summary;

  [5, 4, 3, 2].forEach(star => {
    const count = ratingDistribution[star] || 0;
    const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;

    const row = document.createElement("div");
    row.className = "star-row";
    row.innerHTML = `
      <div>${star} stars</div>
      <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div style="opacity:.7; text-align:right;">${count}</div>
    `;
    container.appendChild(row);
  });
}

/**
 * Render keyword chips
 * @param {Array} reviews - Review array
 * @param {HTMLElement} container - Container element
 * @param {Number} limit - Maximum number of keywords
 */
export function renderKeywordChips(reviews, container, limit = 10) {
  if (!container) return;

  const keywords = extractKeywords(reviews, limit);
  container.innerHTML = "";

  if (keywords.length === 0) return;

  keywords.forEach(({ keyword, count }) => {
    const chip = document.createElement("span");
    chip.className = "review-pill";
    chip.textContent = keyword;
    chip.title = `${count} mentions`;
    container.appendChild(chip);
  });
}

/**
 * Load and render a review page
 * @param {String} slug - Page slug from config
 * @param {Number} page - Page number (default: 1)
 */
export function loadReviewPage(slug, page = 1) {
  // Find page config
  const pageConfig = reviewPages.find(p => p.slug === slug);
  if (!pageConfig) {
    console.error(`Page config not found for slug: ${slug}`);
    return;
  }

  // Load all reviews
  const allReviews = loadReviews();
  if (allReviews.length === 0) {
    console.error('No reviews loaded');
    return;
  }

  // Apply filters
  const filteredReviews = applyFilters(allReviews, pageConfig.filter);

  // Calculate summary
  const summary = calculateSummary(filteredReviews);

  // Paginate
  const { paginatedReviews, totalPages, currentPage, hasNextPage, hasPrevPage } = 
    paginateReviews(filteredReviews, page, 50);

  // Render page elements
  renderSEOPage(pageConfig, summary, paginatedReviews, {
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    totalReviews: filteredReviews.length
  });

  return {
    pageConfig,
    summary,
    paginatedReviews,
    totalPages,
    currentPage,
    totalReviews: filteredReviews.length
  };
}

/**
 * Render SEO page elements
 * @param {Object} pageConfig - Page configuration
 * @param {Object} summary - Rating summary
 * @param {Array} reviews - Paginated reviews to display
 * @param {Object} pagination - Pagination info
 */
export function renderSEOPage(pageConfig, summary, reviews, pagination) {
  // Update H1
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.textContent = pageConfig.title;
  }

  // Update intro paragraph
  const introEl = document.getElementById('review-intro');
  if (introEl) {
    introEl.textContent = pageConfig.intro;
  }

  // Update rating summary
  const ratingEl = document.getElementById('average-rating');
  if (ratingEl) {
    ratingEl.innerHTML = summary.ratingAverage.toFixed(2) + ' <span class="stars">★★★★★</span>';
  }

  const countEl = document.getElementById('review-count');
  if (countEl) {
    countEl.textContent = summary.reviewCount.toLocaleString();
  }

  // Render rating bars
  const barsEl = document.getElementById('rating-bars');
  if (barsEl) {
    renderRatingBars(summary, barsEl);
  }

  // Render keyword chips
  const chipsEl = document.getElementById('review-pills');
  if (chipsEl) {
    renderKeywordChips(reviews, chipsEl, 10);
  }

  // Render review cards
  const gridEl = document.getElementById('review-grid');
  if (gridEl) {
    renderReviewCards(reviews, gridEl);
  }

  // Render pagination
  const paginationEl = document.getElementById('review-pagination');
  if (paginationEl) {
    const baseUrl = `/pages/reviews/${pageConfig.category}/${pageConfig.slug}`;
    paginationEl.innerHTML = generatePaginationHTML(
      pagination.currentPage,
      pagination.totalPages,
      baseUrl
    );
  }

  // Update schema
  updateSchema(pageConfig, summary, reviews);
}

/**
 * Update structured data schema
 * @param {Object} pageConfig - Page configuration
 * @param {Object} summary - Rating summary
 * @param {Array} reviews - Reviews to include in schema
 */
export function updateSchema(pageConfig, summary, reviews) {
  // Remove existing schema
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Create ItemList schema with Review items
  const reviewItems = reviews.slice(0, 5).map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.reviewer || "Verified Customer"
    },
    "reviewBody": review.message,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.star_rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "datePublished": review.date_reviewed || ""
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageConfig.title,
    "description": pageConfig.metaDescription,
    "numberOfItems": summary.reviewCount.toString(),
    "itemListElement": reviewItems
  };

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(schemaScript);
}

// Export default function for easy access
export default {
  loadReviews,
  applyFilters,
  calculateSummary,
  paginateReviews,
  renderReviewCards,
  renderRatingBars,
  renderKeywordChips,
  loadReviewPage,
  renderSEOPage,
  updateSchema
};
