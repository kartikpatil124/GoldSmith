import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '/' },
  image: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  video: { type: String, default: '' },
  bgColor: { type: String, default: '' },
  textColor: { type: String, default: '' },
  pageKey: { 
    type: String, 
    required: true,
    // e.g. 'home', 'shop', 'collections', 'bridal', 'about', 'contact', 'all'
  },
  position: { 
    type: String, 
    enum: ['hero', 'mid', 'footer', 'popup', 'announcement', 'sidebar'],
    default: 'hero'
  },
  deviceVisibility: { type: String, enum: ['all', 'desktop', 'mobile'], default: 'all' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
