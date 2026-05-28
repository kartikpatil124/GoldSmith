import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Statistics (Inquiry-based)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const pendingReplies = await Inquiry.countDocuments({ status: { $in: ['new', 'viewed', 'in progress', 'waiting for customer reply'] } });
    const completedInquiries = await Inquiry.countDocuments({ status: 'completed' });
    const customDesignRequests = await Inquiry.countDocuments({ inquiryType: 'Customization Inquiry' });
    
    const totalCustomers = await User.countDocuments({ role: { $in: ['Customer', 'customer'] } });
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });

    // Recent inquiries
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email');

    // Calculate response time average
    const respondedInquiries = await Inquiry.find({ responseTime: { $exists: true } });
    const avgResponseTime = respondedInquiries.length > 0 
      ? Math.round(respondedInquiries.reduce((acc, curr) => acc + (curr.responseTime || 0), 0) / respondedInquiries.length)
      : 0;

    res.json({
      totalInquiries,
      newInquiries,
      pendingReplies,
      completedInquiries,
      customDesignRequests,
      totalCustomers,
      lowStockAlerts: lowStockProducts,
      recentInquiries,
      avgResponseTime
    });
  } catch (error) {
    next(error);
  }
};
