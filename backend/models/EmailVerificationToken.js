import mongoose from 'mongoose';

const emailVerificationTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Token automatically expires in 10 minutes (600 seconds)
  },
});

const EmailVerificationToken = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
export default EmailVerificationToken;
