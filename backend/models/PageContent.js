import mongoose from 'mongoose';

const contentItemSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String },
  link: { type: String },
  linkText: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { _id: true });

const pageContentSchema = new mongoose.Schema({
  pageKey: { 
    type: String, 
    required: true,
    // e.g. 'home', 'shop', 'collections', 'bridal', 'about', 'contact', 'faq'
  },
  sectionKey: {
    type: String,
    required: true,
    // e.g. 'hero', 'intro', 'cta', 'testimonials', 'trust_badges', 'story'
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  image: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  video: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  ctaSecondaryText: { type: String, default: '' },
  ctaSecondaryLink: { type: String, default: '' },
  items: [contentItemSchema],
  isActive: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

// Compound unique index
pageContentSchema.index({ pageKey: 1, sectionKey: 1 }, { unique: true });

const PageContent = mongoose.model('PageContent', pageContentSchema);
export default PageContent;
