import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    budget: { type: String },
    description: { type: String, required: true },
    type: { type: String },
    metal: { type: String },
    gemstone: { type: String },
    size: { type: String },
    referenceImage: { type: String },
    referenceImages: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' },
    estimatedPrice: { type: Number }
  },
  { timestamps: true }
);

const CustomRequest = mongoose.model('CustomRequest', customRequestSchema);
export default CustomRequest;
