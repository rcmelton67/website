# Dynamic Review SEO Engine

## Overview

This engine powers dynamic SEO review landing pages that:
- Dynamically filter reviews based on configurable criteria
- Paginate results automatically
- Recalculate rating summaries for filtered datasets
- Update automatically when new reviews are added
- Reuse existing review card rendering system

## Architecture

### Files

- `review-filters.js` - Filter function definitions
- `review-page-config.js` - Page configuration (slug, title, filters, etc.)
- `review-utils.js` - Utility functions (pagination, summary calculation, etc.)
- `review-engine.js` - Main controller (ES6 module version)
- `review-engine-bundle.js` - Bundled version for browser use
- `review-seo-template.html` - HTML template structure
- `generate-pages.js` - Node.js script to generate all HTML pages

## Usage

### Generating Pages

Run the generator script to create all review pages:

```bash
node generate-pages.js
```

This will:
1. Read the page configuration
2. Create category directories (`clusters/`, `products/`, `intent/`, `pet-loss-gifts/`)
3. Generate HTML files for each configured page
4. Set up proper paths and structure

### Adding New Review Pages

1. Add a new entry to `review-page-config.js` (or the config in `review-engine-bundle.js`)
2. Run `generate-pages.js` to create the HTML files
3. Pages will automatically filter and display reviews based on the configured filters

### Filter System

Filters are defined in `review-filters.js`. Each filter is a function that:
- Receives a review object
- Returns `true` if the review matches, `false` otherwise
- Filters can be combined using AND logic

### Page Configuration

Each page config entry includes:
- `slug` - URL slug for the page
- `title` - Page title
- `metaDescription` - SEO meta description
- `filter` - Array of filter names to apply
- `category` - Category directory (`clusters`, `products`, `intent`, `pet-loss-gifts`)
- `intro` - Introduction text for the page
- `relatedCategories` - Array of related page slugs

## How It Works

1. **Page Load**: When a review page loads, it extracts the slug from the URL
2. **Filter Application**: The engine loads all reviews and applies the configured filters
3. **Summary Calculation**: Rating averages and distributions are calculated from filtered reviews
4. **Pagination**: Reviews are paginated (50 per page)
5. **Rendering**: Review cards, rating bars, and keyword chips are rendered using existing card system
6. **Schema**: Structured data (ItemList + Review) is injected into the page

## Important Notes

- **No Data Duplication**: All pages use the same `window.ALL_REVIEWS` dataset
- **Dynamic Updates**: When new reviews are added to the dataset, all pages automatically reflect them
- **Reuses Existing System**: Uses the same review card rendering as the main reviews page
- **SEO Optimized**: Each page has unique title, description, canonical URL, and structured data
