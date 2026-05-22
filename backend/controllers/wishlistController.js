import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [productId] });
    } else {
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
        await wishlist.save();
      }
    }

    wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404);
      return next(new Error('Wishlist not found'));
    }

    wishlist.items = wishlist.items.filter(id => id.toString() !== req.params.productId);
    await wishlist.save();

    const updated = await Wishlist.findOne({ user: req.user._id }).populate('items');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
