import Banner from '../models/Banner.js';

// @desc    Get active banners (public) by page and optional position
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res, next) => {
  try {
    const { pageKey, position } = req.query;
    const now = new Date();
    const filter = {
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    };
    if (pageKey) {
      filter.$or = [{ pageKey }, { pageKey: 'all' }];
    }
    if (position) filter.position = position;
    const banners = await Banner.find(filter).sort('order').lean();
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL banners for admin
// @route   GET /api/banners/all
// @access  Admin
export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort('-createdAt').lean();
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Admin
export const createBanner = async (req, res, next) => {
  try {
    const banner = new Banner(req.body);
    const saved = await banner.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Admin
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    if (!banner) { res.status(404); return next(new Error('Banner not found')); }
    res.json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) { res.status(404); return next(new Error('Banner not found')); }
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    next(error);
  }
};
