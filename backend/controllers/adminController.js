import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'Customer' });
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      pendingOrders,
      lowStockAlerts: lowStockProducts,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};
