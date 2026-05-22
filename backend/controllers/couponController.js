import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort('-createdAt');
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchaseAmount, maxDiscount, startDate, endDate, isActive, usageLimit } = req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      res.status(400);
      return next(new Error('Please provide code, discountType, discountValue, startDate, and endDate'));
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      res.status(400);
      return next(new Error('Coupon code already exists'));
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minPurchaseAmount: Number(minPurchaseAmount) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: Number(usageLimit) || 0,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      return next(new Error('Coupon not found'));
    }

    const { code, discountType, discountValue, minPurchaseAmount, maxDiscount, startDate, endDate, isActive, usageLimit } = req.body;

    if (code) coupon.code = code.toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minPurchaseAmount !== undefined) coupon.minPurchaseAmount = Number(minPurchaseAmount);
    if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount);
    if (startDate) coupon.startDate = new Date(startDate);
    if (endDate) coupon.endDate = new Date(endDate);
    if (isActive !== undefined) coupon.isActive = isActive;
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);

    const updatedCoupon = await coupon.save();
    res.json({ success: true, data: updatedCoupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      return next(new Error('Coupon not found'));
    }

    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      res.status(400);
      return next(new Error('Please provide a coupon code'));
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(400);
      return next(new Error('Invalid coupon code'));
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      res.status(400);
      return next(new Error('Coupon is not yet active'));
    }
    if (now > new Date(coupon.endDate)) {
      res.status(400);
      return next(new Error('Coupon has expired'));
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      return next(new Error('Coupon usage limit reached'));
    }

    if (orderAmount && coupon.minPurchaseAmount > 0 && orderAmount < coupon.minPurchaseAmount) {
      res.status(400);
      return next(new Error(`Minimum order amount of ₹${coupon.minPurchaseAmount} required`));
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = orderAmount ? Math.round((orderAmount * coupon.discountValue) / 100) : coupon.discountValue;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      data: {
        coupon,
        discountAmount,
      }
    });
  } catch (error) {
    next(error);
  }
};
