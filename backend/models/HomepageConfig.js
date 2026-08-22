import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const autoRuleSchema = new mongoose.Schema({
  filterBy: { 
    type: String, 
    enum: ['tag', 'category', 'occasion', 'collectionName', 'metal', 'isFeatured', 'isBestSeller', 'isNewArrival', 'badge'],
    default: 'isFeatured' 
  },
  value: { type: String, default: 'true' },
  limit: { type: Number, default: 8 }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  sectionKey: { type: String, required: true }, // e.g. 'featured_creations', 'best_sellers'
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  layout: { type: String, enum: ['grid-4', 'grid-3', 'grid-2', 'carousel', 'featured-large'], default: 'grid-4' },
  productSource: { type: String, enum: ['manual', 'auto'], default: 'auto' },
  products: [productItemSchema],
  autoRule: { type: autoRuleSchema, default: () => ({}) },
  bgStyle: { type: String, enum: ['white', 'cream', 'dark', 'gold'], default: 'cream' },
  showViewAll: { type: Boolean, default: true },
  viewAllLink: { type: String, default: '/shop' },
  maxProducts: { type: Number, default: 8 },
}, { _id: false });

const homepageConfigSchema = new mongoose.Schema({
  configKey: { type: String, default: 'main', unique: true },
  sections: [sectionSchema],
  heroTitle: { type: String, default: 'Elegance Forged in Eternity' },
  heroSubtitle: { type: String, default: 'Discover our exclusive collection of handcrafted fine jewellery' },
  heroCTAText: { type: String, default: 'Explore Collection' },
  heroCTALink: { type: String, default: '/shop' },
  heroSecondaryCTAText: { type: String, default: 'Bespoke Design' },
  heroSecondaryCTALink: { type: String, default: '/custom-order' },
}, { timestamps: true });

const HomepageConfig = mongoose.model('HomepageConfig', homepageConfigSchema);
export default HomepageConfig;
