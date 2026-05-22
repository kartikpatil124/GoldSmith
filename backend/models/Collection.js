import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const autoRuleSchema = new mongoose.Schema({
  filterBy: { type: String, enum: ['tag', 'category', 'occasion', 'collectionName', 'metal', 'isFeatured', 'isBestSeller', 'isNewArrival'], default: 'tag' },
  value: { type: String, default: '' },
  limit: { type: Number, default: 8 }
}, { _id: false });

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  themeColor: { type: String, default: '' },
  icon: { type: String, default: '' },
  productSource: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  products: [productItemSchema],
  autoRule: { type: autoRuleSchema, default: () => ({}) },
  pageVisibility: [{ type: String }], // e.g. ['home', 'collections', 'bridal']
  isVisible: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
}, { timestamps: true });

// Auto-generate slug from name
collectionSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
