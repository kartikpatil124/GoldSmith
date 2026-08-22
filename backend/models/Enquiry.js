import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
