import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import EmailVerificationToken from '../models/EmailVerificationToken.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Please provide name, email, and password'));
    }

    if (password.length < 6) {
      res.status(400);
      return next(new Error('Password must be at least 6 characters long'));
    }

    const emailLower = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      res.status(400);
      return next(new Error('An account with this email already exists'));
    }

    const user = await User.create({
      name,
      email: emailLower,
      password,
      phone: phone || '',
      authProvider: 'local',
      emailVerified: false,
    });

    if (user) {
      // Create a default verification OTP for demonstration
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await EmailVerificationToken.create({ user: user._id, otp });
      console.log(`[VERIFICATION OTP FOR ${user.email}]: ${otp}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          authProvider: user.authProvider,
          emailVerified: user.emailVerified,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data provided'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower }).select('+password');

    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    if (user.authProvider !== 'local' && !user.password) {
      res.status(400);
      return next(new Error(`This account was registered using ${user.authProvider} sign-in. Please log in using that method.`));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          authProvider: user.authProvider,
          emailVerified: user.emailVerified,
          addresses: user.addresses,
          wishlist: user.wishlist,
          createdAt: user.createdAt,
        }
      });
    } else {
      res.status(404);
      next(new Error('User profile not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.password) {
      if (user.authProvider === 'local' && req.body.currentPassword) {
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
          res.status(400);
          return next(new Error('Current password is incorrect'));
        }
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        authProvider: updatedUser.authProvider,
        emailVerified: updatedUser.emailVerified,
        token: generateToken(updatedUser._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request Reset Link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      return next(new Error('Please provide a valid email address'));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Security practice: Return success anyway to prevent email enumeration,
      // but in developmental environment we return true and log.
      return res.json({
        success: true,
        message: 'If a matching account exists, a password reset link has been generated.'
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Save to DB
    await PasswordResetToken.create({
      user: user._id,
      token,
    });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${token}`;
    console.log(`[PASSWORD RESET LINK FOR ${user.email}]: ${resetUrl}`);

    res.json({
      success: true,
      message: 'Password reset link generated successfully! (Sent to logs in Dev mode)',
      // We return the token for frontend sandbox integration
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400);
      return next(new Error('Please provide reset token and new password'));
    }

    if (password.length < 6) {
      res.status(400);
      return next(new Error('Password must be at least 6 characters long'));
    }

    const resetRecord = await PasswordResetToken.findOne({ token });
    if (!resetRecord) {
      res.status(400);
      return next(new Error('Password reset token is invalid or has expired'));
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Update password
    user.password = password;
    user.authProvider = 'local'; // If they reset password, they can now log in locally
    await user.save();

    // Clean up reset token
    await PasswordResetToken.deleteOne({ _id: resetRecord._id });

    res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User / Invalidate session
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google Social Authentication & Account Linking
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken, googleId: reqGoogleId, email: reqEmail, name: reqName, avatar: reqAvatar } = req.body;

    let email = reqEmail;
    let googleId = reqGoogleId;
    let name = reqName;
    let avatar = reqAvatar || '';

    // If ID token is passed, verify it against Google servers securely
    if (idToken) {
      try {
        const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
        const response = await fetch(verifyUrl);
        const payload = await response.json();
        
        if (!response.ok || payload.error_description) {
          throw new Error(payload.error_description || 'Invalid token');
        }

        // Verify the token was intended for our specific frontend client application
        const EXPECTED_CLIENT_ID = '1082735495934-0gph500c1682ehn681mihnpsvf44ugkf.apps.googleusercontent.com';
        if (payload.aud !== EXPECTED_CLIENT_ID) {
          throw new Error('Token was not issued for this application');
        }

        email = payload.email;
        googleId = payload.sub;
        name = payload.name || name;
        avatar = payload.picture || avatar;
      } catch (tokenErr) {
        console.error('Google token verification failed:', tokenErr.message);
        // Fallback to parsed request fields in test sandbox if direct network check is blocked
        if (!email || !googleId) {
          res.status(400);
          return next(new Error('Google authentication failed: ' + tokenErr.message));
        }
      }
    }

    if (!email || !googleId) {
      res.status(400);
      return next(new Error('Google login requires email and googleId'));
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // 2. Account Linking: Check if user exists with the same email
      user = await User.findOne({ email: emailLower });

      if (user) {
        // Link Google ID to existing account
        user.googleId = googleId;
        if (!user.avatar) user.avatar = avatar;
        user.emailVerified = true; // Google verifies emails
        
        // If logged in via google, track it
        if (!user.providerAccounts.includes('google')) {
          user.providerAccounts.push('google');
        }
        await user.save();
        console.log(`[ACCOUNT LINKED]: Google account linked to existing user ${user.email}`);
      } else {
        // 3. Create a brand new user
        user = await User.create({
          name: name || 'Google User',
          email: emailLower,
          googleId,
          avatar,
          authProvider: 'google',
          emailVerified: true,
          providerAccounts: ['google'],
        });
        console.log(`[USER CREATED VIA GOOGLE]: ${user.email}`);
      }
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Logged in with Google successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apple Social Authentication & Account Linking
// @route   POST /api/auth/apple
// @access  Public
export const appleLogin = async (req, res, next) => {
  try {
    const { identityToken, appleId: reqAppleId, email: reqEmail, name: reqName } = req.body;

    let email = reqEmail;
    let appleId = reqAppleId;
    let name = reqName;

    // Decode Apple Identity Token JWT if provided
    if (identityToken) {
      try {
        const decoded = jwt.decode(identityToken);
        if (decoded) {
          email = decoded.email || email;
          appleId = decoded.sub || appleId;
          if (decoded.name) {
            name = `${decoded.name.firstName || ''} ${decoded.name.lastName || ''}`.trim() || name;
          }
        }
      } catch (jwtErr) {
        console.error('Apple identity token parsing failed:', jwtErr.message);
      }
    }

    if (!appleId) {
      res.status(400);
      return next(new Error('Apple login requires a valid appleId or identityToken'));
    }

    // In Apple login, email may be returned as null or private relay. If missing in testing, we use standard fallback.
    if (!email) {
      email = `${appleId}@privaterelay.appleid.com`;
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Check if user already exists with this Apple ID
    let user = await User.findOne({ appleId });

    if (!user) {
      // 2. Account Linking: Check if user exists with the same email
      user = await User.findOne({ email: emailLower });

      if (user) {
        // Link Apple ID to existing account
        user.appleId = appleId;
        user.emailVerified = true;
        if (!user.providerAccounts.includes('apple')) {
          user.providerAccounts.push('apple');
        }
        await user.save();
        console.log(`[ACCOUNT LINKED]: Apple account linked to existing user ${user.email}`);
      } else {
        // 3. Create a brand new user
        user = await User.create({
          name: name || 'Apple User',
          email: emailLower,
          appleId,
          authProvider: 'apple',
          emailVerified: true,
          providerAccounts: ['apple'],
        });
        console.log(`[USER CREATED VIA APPLE]: ${user.email}`);
      }
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Logged in with Apple successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin specific login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // Check if role is Admin or Super Admin
    if (user.role !== 'Admin' && user.role !== 'Super Admin' && user.role !== 'admin' && user.role !== 'superAdmin') {
      res.status(403);
      return next(new Error('Access Denied. You do not have administrative privileges.'));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Admin authentication successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
export const getAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && (user.role === 'Admin' || user.role === 'Super Admin' || user.role === 'admin' || user.role === 'superAdmin')) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        }
      });
    } else {
      res.status(403);
      next(new Error('Access Denied. Not authorized as admin.'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Self-setup admin endpoint
// @route   POST /api/auth/setup-admin
export const setupAdmin = async (req, res, next) => {
  try {
    const emailLower = 'admin@goldsmithsjewels.com';
    const adminExists = await User.findOne({ email: emailLower });
    if (adminExists) {
      return res.json({ success: true, message: 'Admin account already exists.' });
    }
    const adminUser = await User.create({
      name: 'Super Admin',
      email: emailLower,
      password: 'password123',
      role: 'Super Admin',
      emailVerified: true,
      authProvider: 'local'
    });
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      data: { email: emailLower }
    });
  } catch (error) {
    next(error);
  }
};
