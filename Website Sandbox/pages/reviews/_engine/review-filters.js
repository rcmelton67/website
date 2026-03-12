/**
 * Review Filter Definitions
 * 
 * Each filter function receives a review object and returns true/false.
 * Filters work against the existing review dataset structure.
 */

export const reviewFilters = {
  /**
   * Dog reviews - matches reviews mentioning dogs
   */
  dog_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const dogKeywords = ['dog', 'puppy', 'pup', 'canine', 'golden retriever', 'lab', 'labrador', 'shepherd', 'dachshund', 'bulldog', 'husky', 'akita', 'pyrenees', 'spaniel'];
    return dogKeywords.some(keyword => msg.includes(keyword));
  },

  /**
   * Cat reviews - matches reviews mentioning cats
   */
  cat_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const catKeywords = ['cat', 'kitty', 'kitten', 'feline', 'tabby', 'siamese'];
    return catKeywords.some(keyword => msg.includes(keyword));
  },

  /**
   * Granite reviews - matches reviews mentioning granite
   */
  granite_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('granite') || msg.includes('engraved granite');
  },

  /**
   * River rock reviews - matches reviews mentioning river rock or natural stone
   */
  river_rock_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('river rock') || msg.includes('natural stone') || msg.includes('rock memorial');
  },

  /**
   * Cast stone reviews - matches reviews mentioning cast stone
   */
  cast_stone_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    return msg.includes('cast stone') || msg.includes('cast-stone');
  },

  /**
   * Pet loss gift reviews - matches reviews mentioning gifts or sympathy
   */
  pet_loss_gift: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const giftKeywords = ['gift', 'sympathy', 'memorial gift', 'thoughtful gift', 'perfect gift'];
    return giftKeywords.some(keyword => msg.includes(keyword));
  },

  /**
   * Pet loss + sympathy gift reviews (merged intent)
   * Broadens matching so this page has enough real reviews.
   */
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

  /**
   * Quality/craftsmanship reviews - matches reviews emphasizing quality
   */
  quality_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const qualityKeywords = ['quality', 'craftsmanship', 'well made', 'excellent quality', 'beautiful work', 'perfect engraving'];
    return qualityKeywords.some(keyword => msg.includes(keyword));
  },

  /**
   * Durability reviews - matches reviews mentioning durability or lasting
   */
  durability_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const durabilityKeywords = ['durable', 'lasting', 'last forever', 'weather', 'outdoor', 'permanent'];
    return durabilityKeywords.some(keyword => msg.includes(keyword));
  },

  /**
   * Custom engraving reviews - matches reviews mentioning custom or personalization
   */
  custom_engraving_reviews: (review) => {
    if (!review.message) return false;
    const msg = review.message.toLowerCase();
    const customKeywords = ['custom', 'personalized', 'engraving', 'engraved', 'personal message'];
    return customKeywords.some(keyword => msg.includes(keyword));
  }
};
