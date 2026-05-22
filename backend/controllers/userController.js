import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get all customers
// @route   GET /api/users/customers
// @access  Private/Admin
export const getCustomers = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
          ]
        }
      : {};

    const customers = await User.find({ role: 'Customer', ...keyword })
      .select('-password')
      .sort('-createdAt');

    res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer details with order history
// @route   GET /api/users/customers/:id
// @access  Private/Admin
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      res.status(404);
      return next(new Error('Customer not found'));
    }

    // Get customer's orders
    const orders = await Order.find({ user: req.params.id }).sort('-createdAt');

    res.json({
      success: true,
      data: {
        customer,
        orders,
        totalOrders: orders.length,
        totalSpent: orders.reduce((acc, o) => acc + o.totalPrice, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};
