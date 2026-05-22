import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isVerifiedPurchase: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Admin who created the product
    },
    // === Basic Details ===
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    barcode: { type: String },
    brand: { type: String, default: 'goldsmiths Jewels' },
    category: { type: String, required: true },
    subcategory: { type: String },
    collectionName: { type: String },
    productType: { type: String }, // e.g., Solitaire, Eternity, Halo
    gender: { type: String, enum: ['Women', 'Men', 'Unisex', 'Kids', ''], default: '' },
    occasion: { type: String }, // Bridal, Wedding, Engagement, Anniversary, Daily Wear, Party, Festive, Gifting
    style: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    pinnedOrder: { type: Number, default: 0 },
    placements: [{ type: String }], // e.g. ['home_featured', 'bridal', 'collections_royal', 'gift_page', 'new_arrivals']
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    badge: { type: String }, // e.g., "new", "sale", "trending"
    tags: [{ type: String }],

    // === Pricing ===
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 },
    taxRate: { type: Number, default: 3 }, // GST %

    // === Inventory ===
    countInStock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    availabilityStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'made_to_order', 'pre_order'], default: 'in_stock' },

    // === Jewellery-Specific ===
    metal: { type: String, required: true }, // e.g., 18K Gold, 22K Gold, Platinum
    purity: { type: String }, // e.g., 18K / 750, 22K / 916
    karat: { type: String }, // e.g., 18K, 22K, 24K
    grossWeight: { type: String },
    netWeight: { type: String },
    weight: { type: String }, // legacy field
    dimensions: { type: String },
    finish: { type: String }, // High Polish, Matte, Satin, Antique
    certification: { type: String },
    certificateFile: { type: String },
    hallmark: { type: String },

    // Gemstone Details
    gemstoneDetails: {
      type: { type: String },
      count: { type: String },
      cut: { type: String },
      color: { type: String },
      clarity: { type: String },
      carat: { type: String },
      shape: { type: String },
    },

    // Size Details
    size: { type: String },
    ringSize: { type: String },
    braceletSize: { type: String },
    necklaceLength: { type: String },
    adjustable: { type: Boolean, default: false },

    // === Description Fields ===
    description: { type: String, required: true },
    shortDescription: { type: String },
    careInstructions: { type: String },
    deliveryEstimate: { type: String },
    returnPolicy: { type: String },
    warranty: { type: String },
    customizable: { type: Boolean, default: false },

    // === SEO Fields ===
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    imageAltText: { type: String },

    // === Media ===
    featuredImage: { type: String },
    images: [{ type: String }], // Array of image URLs
    video: { type: String },
    media360: { type: String },

    // === Reviews ===
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Auto-calculate discount percentage
  if (this.salePrice && this.price && this.salePrice < this.price) {
    this.discountPercentage = Math.round(((this.price - this.salePrice) / this.price) * 100);
    this.discountPrice = this.salePrice;
  }
  // Auto-set availability status
  if (this.countInStock === 0) {
    this.availabilityStatus = 'out_of_stock';
  } else if (this.countInStock <= (this.lowStockThreshold || 5)) {
    this.availabilityStatus = 'in_stock'; // still in stock, just low
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
