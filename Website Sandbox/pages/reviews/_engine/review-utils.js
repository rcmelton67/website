/**
 * Review Utility Functions
 * 
 * Helper functions for review processing, pagination, and rendering.
 */

/**
 * Normalize text for searching/filtering
 */
export function normalizeText(text) {
  return (text || "").toLowerCase().trim();
}

/**
 * Calculate rating summary from filtered reviews
 * @param {Array} reviews - Filtered review array
 * @returns {Object} Summary object with ratingAverage, reviewCount, ratingDistribution
 */
export function calculateSummary(reviews) {
  // Exclude 1-star reviews per spec
  const validReviews = reviews.filter(r => 
    typeof r.star_rating === "number" && r.star_rating !== 1 && r.message
  );

  const reviewCount = validReviews.length;

  if (reviewCount === 0) {
    return {
      ratingAverage: 0,
      reviewCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0 }
    };
  }

  // Calculate average rating
  const ratingSum = validReviews.reduce((sum, r) => sum + r.star_rating, 0);
  const ratingAverage = ratingSum / reviewCount;

  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0 };
  validReviews.forEach(r => {
    if (ratingDistribution[r.star_rating] !== undefined) {
      ratingDistribution[r.star_rating]++;
    }
  });

  return {
    ratingAverage: isFinite(ratingAverage) ? Number(ratingAverage.toFixed(2)) : 0,
    reviewCount,
    ratingDistribution
  };
}

/**
 * Paginate reviews array
 * @param {Array} reviews - Review array
 * @param {Number} page - Current page number (1-indexed)
 * @param {Number} pageSize - Number of reviews per page
 * @returns {Object} Object with paginatedReviews, totalPages, currentPage
 */
export function paginateReviews(reviews, page = 1, pageSize = 50) {
  const totalPages = Math.ceil(reviews.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedReviews = reviews.slice(start, end);

  return {
    paginatedReviews,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

/**
 * Generate pagination HTML
 * @param {Number} currentPage - Current page number
 * @param {Number} totalPages - Total number of pages
 * @param {String} baseUrl - Base URL for pagination links (without trailing slash)
 * @returns {String} HTML string for pagination
 */
export function generatePaginationHTML(currentPage, totalPages, baseUrl) {
  if (totalPages <= 1) return "";

  let html = '<nav class="pagination">';

  // Previous Link
  if (currentPage > 1) {
    const prevLink = currentPage === 2 
      ? `${baseUrl}/index.html` 
      : `${baseUrl}/page/${currentPage - 1}/index.html`;
    html += `<a href="${prevLink}">Previous</a>`;
  }

  // Page Numbers
  const showPages = new Set([1, totalPages]);
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) showPages.add(i);
  }
  const sorted = [...showPages].sort((a, b) => a - b);

  let prev = 0;
  for (const p of sorted) {
    if (prev > 0 && p - prev > 1) {
      html += `<span style="padding:0 8px; display:flex; align-items:center;">...</span>`;
    }

    const isActive = p === currentPage;
    let link = p === 1 
      ? `${baseUrl}/index.html` 
      : `${baseUrl}/page/${p}/index.html`;

    html += `<a href="${link}" class="${isActive ? 'active' : ''}">${p}</a>`;
    prev = p;
  }

  // Next Link
  if (currentPage < totalPages) {
    html += `<a href="${baseUrl}/page/${currentPage + 1}/index.html">Next</a>`;
  }

  html += '</nav>';
  return html;
}

/**
 * Format date string for display
 * @param {String} dateString - Date string in format "MM/DD/YYYY"
 * @returns {String} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const [month, day, year] = dateString.split("/");
    const months = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"];
    return `${months[parseInt(month) - 1]} ${day}, ${year}`;
  } catch (e) {
    return dateString;
  }
}

/**
 * Extract keywords from reviews for keyword chips
 * @param {Array} reviews - Review array
 * @param {Number} limit - Maximum number of keywords to return
 * @returns {Array} Array of {keyword, count} objects
 */
export function extractKeywords(reviews, limit = 10) {
  const keywordCounts = {};
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'our', 'my', 'your', 'his', 'her', 'its', 'their', 'very', 'much', 'so', 'too', 'also', 'just', 'only', 'more', 'most', 'some', 'any', 'all', 'each', 'every', 'both', 'few', 'many', 'other', 'such', 'no', 'not', 'nor', 'than', 'then', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'if', 'else', 'while', 'as', 'from', 'up', 'about', 'into', 'through', 'during', 'including', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'concerning', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'including', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'concerning']);

  reviews.forEach(review => {
    if (!review.message) return;
    const words = review.message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    words.forEach(word => {
      keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });
  });

  return Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}
