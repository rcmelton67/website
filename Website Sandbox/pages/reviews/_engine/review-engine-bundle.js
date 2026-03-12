/**
 * Review Engine Bundle
 * 
 * Bundled version of the review engine for browser use.
 * Exposes ReviewEngine global object.
 */

(function() {
  'use strict';

  // Review Filters
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
    }
  };

  // Review Page Configuration
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

  // Utility Functions
  function formatDate(dateString) {
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

  function calculateSummary(reviews) {
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

    const ratingSum = validReviews.reduce((sum, r) => sum + r.star_rating, 0);
    const ratingAverage = ratingSum / reviewCount;

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

  function paginateReviews(reviews, page = 1, pageSize = 50) {
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

  function generatePaginationHTML(currentPage, totalPages, basePath) {
    if (totalPages <= 1) return "";

    // basePath must be root-absolute and end with trailing slash:
    // /reviews/{category}/{slug}/
    let html = '<nav class="pagination">';

    if (currentPage > 1) {
      const prevLink = currentPage === 2
        ? `${basePath}`
        : `${basePath}page/${currentPage - 1}/`;
      html += `<a href="${prevLink}">Previous</a>`;
    }

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
        ? `${basePath}`
        : `${basePath}page/${p}/`;

      html += `<a href="${link}" class="${isActive ? 'active' : ''}">${p}</a>`;
      prev = p;
    }

    if (currentPage < totalPages) {
      html += `<a href="${basePath}page/${currentPage + 1}/">Next</a>`;
    }

    html += '</nav>';
    return html;
  }

  function getReviewRouteFromPathname(pathname) {
    const p = pathname || window.location.pathname || "";
    // Match:
    // /reviews/{category}/{slug}/
    // /reviews/{category}/{slug}/page/{n}/
    const m = p.match(/^\/reviews\/(clusters|products|intent|pet-loss-gifts)\/([^/]+)\/(?:page\/\d+\/)?$/);
    if (!m) return null;
    return { category: m[1], slug: m[2] };
  }

  function extractKeywords(reviews, limit = 10) {
    const keywordCounts = {};
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'our', 'my', 'your', 'his', 'her', 'its', 'their', 'very', 'much', 'so', 'too', 'also', 'just', 'only', 'more', 'most', 'some', 'any', 'all', 'each', 'every', 'both', 'few', 'many', 'other', 'such', 'no', 'not', 'nor', 'than', 'then', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'if', 'else', 'while', 'as', 'from', 'up', 'about', 'into', 'through', 'during', 'including', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'concerning']);

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

  function titleCaseWord(s) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function normalizeForMatch(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function intentLinkForKeyword(keyword) {
    // Link chips to intent pages *only when available*
    const k = (keyword || "").toLowerCase();

    // Map common terms to existing intent pages (current reality)
    if (k.includes("engraving") || k.includes("engraved")) return "custom-engraving-pet-memorial-reviews";
    if (k.includes("durable") || k.includes("lasting") || k.includes("weather")) return "durability-pet-memorial-reviews";
    if (k.includes("quality") || k.includes("craftsmanship")) return "quality-pet-memorial-reviews";

    return null;
  }

  function applyChipFilter(reviews, chipKey) {
    if (!chipKey) return reviews;
    const key = normalizeForMatch(chipKey);

    const synonyms = {
      quality: ["quality", "craftsmanship", "well made", "high quality", "amazing quality"],
      durability: ["durable", "lasting", "weather", "outdoor", "permanent"],
      engraving: ["engraving", "engraved", "deep engraving", "clear engraving"],
      shipping: ["shipping", "fast shipping", "quick shipping", "arrived", "delivery"],
      service: ["service", "customer service", "communication", "seller", "respond"],
      recommend: ["recommend", "highly recommend", "recommended"]
    };

    const bucket = synonyms[key];
    const needles = bucket ? bucket.map(normalizeForMatch) : [key];

    return reviews.filter(r => {
      const msg = normalizeForMatch(r.message);
      return needles.some(n => n && msg.includes(n));
    });
  }

  // Engine Functions
  function loadReviews() {
    if (!window.ALL_REVIEWS) {
      console.error('Review data not loaded. Ensure reviews-data.js is included.');
      return [];
    }
    return window.ALL_REVIEWS;
  }

  function applyFilters(reviews, filterNames) {
    if (!Array.isArray(filterNames) || filterNames.length === 0) {
      return reviews;
    }

    return reviews.filter(review => {
      if (review.star_rating === 1) return false;
      if (!review.message) return false;

      return filterNames.every(filterName => {
        const filterFn = reviewFilters[filterName];
        if (!filterFn) {
          console.warn(`Filter "${filterName}" not found`);
          return true;
        }
        return filterFn(review);
      });
    });
  }

  function renderReviewCards(reviews, container) {
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

  function renderRatingBars(summary, container) {
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

  function renderKeywordChips(reviews, container, limit = 10) {
    if (!container) return;

    const keywords = extractKeywords(reviews, limit);
    container.innerHTML = "";

    if (keywords.length === 0) return;

    keywords.forEach(({ keyword, count }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "review-pill review-chip";
      btn.dataset.chip = keyword;
      btn.textContent = titleCaseWord(keyword);
      btn.title = `${count} mentions`;
      container.appendChild(btn);
    });
  }

  function renderMostMentionedSection(reviews, container, limit = 10) {
    if (!container) return;
    const keywords = extractKeywords(reviews, limit);
    container.innerHTML = "";

    keywords.forEach(({ keyword }) => {
      const intentSlug = intentLinkForKeyword(keyword);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "review-pill review-chip";
      btn.dataset.chip = keyword;
      if (intentSlug) btn.dataset.intent = intentSlug;
      btn.textContent = titleCaseWord(keyword);
      container.appendChild(btn);
    });
  }

  function buildBreadcrumbListSchema(pageConfig) {
    const urlBase = "https://meltonmemorials.com";
    const categoryUrl = `${urlBase}/reviews/${pageConfig.category}/`;
    const pageUrl = `${urlBase}/reviews/${pageConfig.category}/${pageConfig.slug}/`;

    return {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${urlBase}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Reviews",
          "item": `${urlBase}/reviews/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": pageConfig.category,
          "item": categoryUrl
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": pageConfig.title,
          "item": pageUrl
        }
      ]
    };
  }

  function updateSchema(pageConfig, summary, reviews) {
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // AggregateRating (matches filtered dataset)
    const aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": summary.ratingAverage.toFixed(2),
      "reviewCount": summary.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };

    // Review items (use visible reviews; cap at 5)
    const reviewItems = reviews.slice(0, 5).map((review, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
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
      }
    }));

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": pageConfig.title,
          "description": pageConfig.metaDescription,
          "numberOfItems": summary.reviewCount.toString(),
          "itemListElement": reviewItems
        },
        {
          "@type": "WebPage",
          "name": pageConfig.title,
          "url": `https://meltonmemorials.com/reviews/${pageConfig.category}/${pageConfig.slug}/`,
          "aggregateRating": aggregateRating
        },
        buildBreadcrumbListSchema(pageConfig)
      ]
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(schemaScript);
  }

  function renderSEOPage(pageConfig, summary, reviews, pagination) {
    // Update H1 if it exists
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.textContent = pageConfig.title;
    }

    // Update intro paragraph if it exists
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

    // Render "Most Mentioned by Customers" (links to intent pages when available)
    const mostMentionedEl = document.getElementById('most-mentioned');
    if (mostMentionedEl) {
      renderMostMentionedSection(reviews, mostMentionedEl, 10);
    }

    // Render review cards
    const gridEl = document.getElementById('review-grid');
    if (gridEl) {
      renderReviewCards(reviews, gridEl);
    }

    // Render pagination
    const paginationEl = document.getElementById('review-pagination');
    if (paginationEl) {
      const route = getReviewRouteFromPathname(window.location.pathname) || {
        category: pageConfig.category,
        slug: pageConfig.slug
      };
      const basePath = `/reviews/${route.category}/${route.slug}/`;
      console.log("[reviews-pagination] basePath:", basePath);
      if (pagination.totalPages > 1) {
        const preview = [];
        preview.push(basePath);
        if (pagination.totalPages >= 2) preview.push(`${basePath}page/2/`);
        if (pagination.totalPages >= 3) preview.push(`${basePath}page/3/`);
        console.log("[reviews-pagination] sample links:", preview);
      }
      paginationEl.innerHTML = generatePaginationHTML(
        pagination.currentPage,
        pagination.totalPages,
        basePath
      );
    }

    // Render related links
    const relatedEl = document.getElementById('related-links');
    if (relatedEl && pageConfig.relatedCategories) {
      relatedEl.innerHTML = "";
      pageConfig.relatedCategories.forEach(relatedSlug => {
        const relatedPage = reviewPages.find(p => p.slug === relatedSlug);
        if (relatedPage) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `/reviews/${relatedPage.category}/${relatedPage.slug}/`;
          a.textContent = relatedPage.title;
          li.appendChild(a);
          relatedEl.appendChild(li);
        }
      });
    }

    // Schema is updated by loadReviewPage() so it remains tied to the base page dataset.
  }

  function loadReviewPage(slug, page = 1) {
    const pageConfig = reviewPages.find(p => p.slug === slug);
    if (!pageConfig) {
      console.error(`Page config not found for slug: ${slug}`);
      return;
    }

    const allReviews = loadReviews();
    if (allReviews.length === 0) {
      console.error('No reviews loaded');
      return;
    }

    // Explicit chip state management
    const state = {
      pageSlug: slug,
      baseReviews: applyFilters(allReviews, pageConfig.filter),
      currentReviews: [],
      activeChip: null,
      currentPage: page || 1,
      baseSummary: null
    };

    state.baseSummary = calculateSummary(state.baseReviews);
    state.currentReviews = state.baseReviews;

    function ensureChipStatusUI() {
      let status = document.getElementById("chip-filter-status");
      if (!status) {
        const anchor = document.getElementById("most-mentioned-section") || document.querySelector(".review-summary");
        status = document.createElement("div");
        status.id = "chip-filter-status";
        status.style.marginTop = "12px";
        status.style.opacity = "0.85";
        if (anchor && anchor.parentNode) {
          anchor.parentNode.insertBefore(status, anchor.nextSibling);
        } else {
          document.body.appendChild(status);
        }
      }
      return status;
    }

    function updateChipStatusUI() {
      const status = ensureChipStatusUI();
      if (!state.activeChip) {
        status.innerHTML = "";
        return;
      }
      const label = titleCaseWord(state.activeChip);
      status.innerHTML = `Showing reviews matching: <strong>${label}</strong> <button type="button" id="chip-clear" class="review-pill" style="margin-left:10px;">Clear</button>`;
      const clearBtn = document.getElementById("chip-clear");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          state.activeChip = null;
          state.currentPage = 1;
          state.currentReviews = state.baseReviews;
          render();
        });
      }
    }

    function setActiveChipStyles() {
      document.querySelectorAll(".review-chip").forEach(btn => {
        const key = (btn.dataset.chip || "").trim();
        if (state.activeChip && normalizeForMatch(key) === normalizeForMatch(state.activeChip)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    function render() {
      state.currentReviews = applyChipFilter(state.baseReviews, state.activeChip);
      const viewSummary = calculateSummary(state.currentReviews);

      const { paginatedReviews, totalPages, currentPage, hasNextPage, hasPrevPage } =
        paginateReviews(state.currentReviews, state.currentPage, 50);

      renderSEOPage(pageConfig, viewSummary, paginatedReviews, {
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        totalReviews: state.currentReviews.length
      });

      // Schema must remain based on the BASE page dataset (not temporary chip view)
      updateSchema(pageConfig, state.baseSummary, state.baseReviews.slice(0, 5));

      updateChipStatusUI();
      setActiveChipStyles();
    }

    function onChipClick(chipKey) {
      state.activeChip = (state.activeChip && normalizeForMatch(state.activeChip) === normalizeForMatch(chipKey))
        ? null
        : chipKey;
      state.currentPage = 1;
      render();
    }

    function wireChipDelegation() {
      const containers = [
        document.getElementById("review-pills"),
        document.getElementById("most-mentioned")
      ].filter(Boolean);

      containers.forEach(container => {
        container.addEventListener("click", (e) => {
          const btn = e.target.closest(".review-chip");
          if (!btn) return;
          e.preventDefault();
          const chipKey = (btn.dataset.chip || "").trim();
          if (!chipKey) return;
          onChipClick(chipKey);
        });
      });
    }

    wireChipDelegation();
    render();

    return {
      pageConfig,
      totalReviews: state.baseReviews.length
    };
  }

  // Expose to global scope
  window.ReviewEngine = {
    loadReviews,
    applyFilters,
    calculateSummary,
    paginateReviews,
    renderReviewCards,
    renderRatingBars,
    renderKeywordChips,
    loadReviewPage,
    renderSEOPage,
    updateSchema,
    reviewPages,
    reviewFilters
  };

})();
