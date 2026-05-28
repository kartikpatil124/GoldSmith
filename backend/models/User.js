import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['Customer', 'Super Admin', 'Admin', 'Product Manager', 'Order Manager', 'Inventory Manager', 'customer', 'admin', 'superAdmin'],
      default: 'Customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'apple'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
    },
    appleId: {
      type: String,
      default: null,
    },
    providerAccounts: {
      type: mongoose.Schema.Types.Mixed,
      default: [], // Stores raw provider account metadata if needed
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    addresses: [
      {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, default: '' },
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false },
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for fullName mapping to name
userSchema.virtual('fullName')
  .get(function () {
    return this.name;
  })
  .set(function (fullName) {
    this.name = fullName;
  });

// Hashed password alias to password
userSchema.virtual('passwordHash')
  .get(function () {
    return this.password;
  })
  .set(function (hash) {
    this.password = hash;
  });

// Encrypt password using bcrypt pre-save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
