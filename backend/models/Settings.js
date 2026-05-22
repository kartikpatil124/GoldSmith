import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'goldsmiths Jewels' },
    logo: { type: String, default: '' },
    tagline: { type: String, default: 'The Art of Fine Jewellery' },
    email: { type: String, default: 'support@goldsmithsjewels.com' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '123, Jubilee Hills, Hyderabad' },
    city: { type: String, default: 'Hyderabad' },
    state: { type: String, default: 'Telangana' },
    pincode: { type: String, default: '500033' },
    country: { type: String, default: 'India' },
    // Shipping
    shippingRate: { type: Number, default: 500 },
    freeShippingThreshold: { type: Number, default: 50000 },
    expressShippingRate: { type: Number, default: 1500 },
    // Payment
    codEnabled: { type: Boolean, default: true },
    upiEnabled: { type: Boolean, default: true },
    cardEnabled: { type: Boolean, default: true },
    // Tax
    gstRate: { type: Number, default: 3 },
    gstNumber: { type: String, default: '' },
    // SEO
    metaTitle: { type: String, default: 'goldsmiths Jewels — Premium Handcrafted Jewellery' },
    metaDescription: { type: String, default: 'Discover exquisite handcrafted gold, diamond, and gemstone jewellery at goldsmiths Jewels.' },
    metaKeywords: { type: String, default: 'jewellery, gold, diamond, rings, necklaces, earrings' },
    // Social Links
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    pinterest: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' },
    // Currency
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
