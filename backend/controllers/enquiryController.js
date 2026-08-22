import Enquiry from '../models/Enquiry.js';

// @desc    Create enquiry (from contact form)
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, product } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      return next(new Error('Please provide name, email, subject, and message'));
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      subject,
      message,
      product
    });

    res.status(201).json({ success: true, data: enquiry, message: 'Enquiry submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({}).sort('-createdAt').populate('product', 'name');
    res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      res.status(404);
      return next(new Error('Enquiry not found'));
    }
    enquiry.status = req.body.status || enquiry.status;
    const updated = await enquiry.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
