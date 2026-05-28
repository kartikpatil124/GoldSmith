import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    productSku: { type: String },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsappNumber: { type: String },
    preferredContactMethod: { 
      type: String, 
      enum: ['Email', 'WhatsApp', 'Both', 'Phone Call'], 
      default: 'WhatsApp' 
    },
    inquiryType: { 
      type: String, 
      enum: [
        'Price Inquiry', 
        'Customization Inquiry', 
        'Bulk Order Inquiry', 
        'Bridal Inquiry', 
        'Gift Inquiry', 
        'Repair Inquiry', 
        'Availability Inquiry', 
        'Appointment Inquiry'
      ], 
      default: 'Price Inquiry' 
    },
    message: { type: String, required: true },
    budgetRange: { type: String },
    customizationNotes: { type: String },
    sizeRequirements: { type: String },
    occasion: { type: String },
    metalPreference: { type: String },
    stonePreference: { type: String },
    attachmentUrls: [{ type: String }],
    status: { 
      type: String, 
      enum: [
        'new', 
        'viewed', 
        'in progress', 
        'quoted', 
        'customization sent', 
        'waiting for customer reply', 
        'completed', 
        'closed', 
        'archived'
      ], 
      default: 'new' 
    },
    adminResponse: { type: String },
    responseSentVia: { type: String, enum: ['Email', 'WhatsApp', 'Both', 'None'], default: 'None' },
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    responseTime: { type: Number },
    followUpDate: { type: Date },
    customerReply: { type: String },
    history: [
      {
        action: { type: String },
        note: { type: String },
        user: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

inquirySchema.pre('save', async function (next) {
  if (this.isNew && !this.inquiryId) {
    try {
      const count = await mongoose.model('Inquiry').countDocuments();
      this.inquiryId = `GS-INQ-${1000 + count + 1}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
