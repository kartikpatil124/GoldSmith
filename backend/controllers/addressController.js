import Address from '../models/Address.js';

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { firstName, lastName, street, city, state, postalCode, country, phone, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      firstName,
      lastName,
      street,
      city,
      state,
      postalCode,
      country: country || 'India',
      phone,
      isDefault: isDefault || false
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      res.status(404);
      return next(new Error('Address not found'));
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    Object.assign(address, req.body);
    const updated = await address.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      res.status(404);
      return next(new Error('Address not found'));
    }

    await Address.deleteOne({ _id: address._id });
    res.json({ success: true, message: 'Address removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res, next) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      res.status(404);
      return next(new Error('Address not found'));
    }

    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};
