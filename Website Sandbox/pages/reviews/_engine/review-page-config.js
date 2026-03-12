/**
 * Review Page Configuration
 * 
 * Each entry generates one SEO landing page.
 * Filters can be combined (AND logic).
 */

export const reviewPages = [
  // Cluster Pages - Pet Type
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

  // Product Pages - Material + Pet Type
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

  // Intent Pages - Pet Loss Gifts
  {
    slug: "pet-loss-sympathy-gift-reviews",
    title: "Pet Loss Sympathy Gift Reviews",
    metaDescription: "When someone loses a beloved pet, memorial stones are often chosen as thoughtful sympathy gifts. Read real customer reviews from people who purchased these memorial stones as pet loss gifts and sympathy gifts.",
    filter: ["pet_loss_sympathy_gift"],
    category: "pet-loss-gifts",
    intro: "When someone loses a beloved pet, memorial stones are often chosen as thoughtful sympathy gifts. Read real customer reviews from people who purchased these memorial stones as pet loss gifts and sympathy gifts.",
    relatedCategories: ["dog-memorial-stone-reviews", "cat-memorial-stone-reviews", "pet-loss-sympathy-gift-reviews"]
  },

  // Quality/Craftsmanship Pages
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
