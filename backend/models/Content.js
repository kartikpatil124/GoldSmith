import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    section: { 
      type: String, 
      required: true, 
      unique: true,
      enum: ['hero', 'banners', 'about', 'faq', 'policies', 'footer', 'testimonials', 'promotions', 'store_message']
    },
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    items: [
      {
        title: { type: String },
        description: { type: String },
        image: { type: String },
        link: { type: String },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
      }
    ],
    isActive: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
