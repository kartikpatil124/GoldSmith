import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Create a new product inquiry
// @route   POST /api/inquiries
// @access  Public (Optional Auth)
export const createInquiry = async (req, res, next) => {
  try {
    const {
      productName,
      productId,
      productSku,
      customerName,
      email,
      phone,
      whatsappNumber,
      preferredContactMethod,
      inquiryType,
      message,
      budgetRange,
      customizationNotes,
      sizeRequirements,
      occasion,
      metalPreference,
      stonePreference,
      attachmentUrls,
    } = req.body;

    if (!customerName || !email || !phone || !message || !productName) {
      res.status(400);
      return next(new Error('Please fill all required fields: customerName, email, phone, message, productName'));
    }

    const inquiryData = {
      productName,
      productSku,
      customerName,
      email,
      phone,
      whatsappNumber: whatsappNumber || phone,
      preferredContactMethod: preferredContactMethod || 'WhatsApp',
      inquiryType: inquiryType || 'Price Inquiry',
      message,
      budgetRange,
      customizationNotes,
      sizeRequirements,
      occasion,
      metalPreference,
      stonePreference,
      attachmentUrls: attachmentUrls || [],
      history: [
        {
          action: 'created',
          note: `Inquiry submitted for ${productName}`,
          user: 'Customer',
        }
      ]
    };

    // If product ID is provided, verify it exists and link it
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        inquiryData.product = productId;
        inquiryData.productSku = product.sku;
      }
    }

    // Link customer if logged in
    if (req.user) {
      inquiryData.customer = req.user._id;
    }

    const inquiry = await Inquiry.create(inquiryData);

    // Send Confirmation Email to Customer
    const customerSubject = `Thank you for your Inquiry - ${inquiry.inquiryId} | Goldsmiths Jewels`;
    const customerHtml = `
      <div style="font-family: 'Playfair Display', serif, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; background-color: #faf8f5;">
        <h2 style="color: #bc9c6c; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Goldsmiths Jewels</h2>
        <hr style="border: 0; border-top: 1px solid #bc9c6c; margin-bottom: 20px;" />
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Thank you for contacting Goldsmiths Jewels. We have received your inquiry for the **${productName}**.</p>
        <p>A dedicated jewellery expert has been assigned to your request and will get in touch with you shortly via your preferred contact method: <strong>${preferredContactMethod}</strong>.</p>
        
        <div style="background-color: #f3efe9; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Inquiry Details</h3>
          <p><strong>Inquiry ID:</strong> ${inquiry.inquiryId}</p>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Inquiry Type:</strong> ${inquiry.inquiryType}</p>
          <p><strong>Your Message:</strong> ${message}</p>
          ${customizationNotes ? `<p><strong>Customization Notes:</strong> ${customizationNotes}</p>` : ''}
          ${budgetRange ? `<p><strong>Budget Range:</strong> ${budgetRange}</p>` : ''}
        </div>

        <p style="font-style: italic; color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Handcrafted luxury jewelry designed for eternity.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: customerSubject,
        html: customerHtml,
      });
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
    }

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries with filters (Admin only)
// @route   GET /api/admin/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res, next) => {
  try {
    const { status, inquiryType, search, productId, customerId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (inquiryType) {
      query.inquiryType = inquiryType;
    }

    if (productId) {
      query.product = productId;
    }

    if (customerId) {
      query.customer = customerId;
    }

    if (search) {
      query.$or = [
        { inquiryId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(query)
      .populate('product', 'name price featuredImage images category')
      .populate('customer', 'name email role')
      .populate('assignedAdmin', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/inquiries/:id
// @access  Private (Owner or Admin)
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('product', 'name price featuredImage images category sku grossWeight metal purity size')
      .populate('customer', 'name email phone role')
      .populate('assignedAdmin', 'name email');

    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }

    // Check permissions (Only Admin or owner Customer can view)
    const isAdmin = ['Admin', 'Super Admin', 'admin', 'superAdmin'].includes(req.user.role);
    const isOwner = inquiry.customer && inquiry.customer._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403);
      return next(new Error('Not authorized to view this inquiry'));
    }

    // Auto-mark as viewed if admin opens a "new" inquiry
    if (isAdmin && inquiry.status === 'new') {
      inquiry.status = 'viewed';
      inquiry.history.push({
        action: 'status_updated',
        note: 'Inquiry viewed by Admin',
        user: 'Admin',
      });
      await inquiry.save();
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/admin/inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400);
      return next(new Error('Please provide status'));
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }

    const oldStatus = inquiry.status;
    inquiry.status = status;
    inquiry.history.push({
      action: 'status_updated',
      note: `Status updated from "${oldStatus}" to "${status}"`,
      user: 'Admin',
    });

    await inquiry.save();

    res.json({
      success: true,
      data: inquiry,
      message: `Inquiry status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to an inquiry (Email/WhatsApp)
// @route   PATCH /api/admin/inquiries/:id/respond
// @access  Private/Admin
export const respondToInquiry = async (req, res, next) => {
  try {
    const { responseMessage, sendVia } = req.body;

    if (!responseMessage || !sendVia) {
      res.status(400);
      return next(new Error('Please provide responseMessage and sendVia (Email, WhatsApp, Both)'));
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }

    // Calculate response time on first reply
    if (!inquiry.adminResponse) {
      const createdDate = new Date(inquiry.createdAt);
      const diffMs = new Date() - createdDate;
      inquiry.responseTime = Math.round(diffMs / 60000); // Response time in minutes
    }

    inquiry.adminResponse = responseMessage;
    inquiry.responseSentVia = sendVia;
    inquiry.assignedAdmin = req.user._id;

    // Transition status to "quoted" or "customization sent" or "in progress"
    const nextStatus = inquiry.inquiryType === 'Customization Inquiry' ? 'customization sent' : 'quoted';
    inquiry.status = nextStatus;

    inquiry.history.push({
      action: 'replied',
      note: `Response sent via ${sendVia}. Message: "${responseMessage.substring(0, 60)}..."`,
      user: 'Admin',
    });

    await inquiry.save();

    // 1. Send Email Response
    let emailSent = false;
    if (sendVia === 'Email' || sendVia === 'Both') {
      const emailSubject = `Response to your Inquiry ${inquiry.inquiryId} | Goldsmiths Jewels`;
      const emailHtml = `
        <div style="font-family: 'Playfair Display', serif, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; background-color: #faf8f5;">
          <h2 style="color: #bc9c6c; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Goldsmiths Jewels</h2>
          <hr style="border: 0; border-top: 1px solid #bc9c6c; margin-bottom: 20px;" />
          <p>Dear <strong>${inquiry.customerName}</strong>,</p>
          <p>Thank you for your patience. A jewellery expert from Goldsmiths Jewels has responded to your inquiry regarding **${inquiry.productName}**.</p>
          
          <div style="background-color: #f3efe9; padding: 20px; border-radius: 4px; border-left: 4px solid #bc9c6c; margin: 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
            ${responseMessage.replace(/\n/g, '<br>')}
          </div>

          <p>To follow up or ask additional questions, you can reply directly to this email or reach us on WhatsApp at your convenience.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/${inquiry.whatsappNumber || inquiry.phone}" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Chat on WhatsApp
            </a>
          </div>

          <p style="font-style: italic; color: #666; font-size: 14px; text-align: center; margin-top: 40px;">
            Handcrafted luxury jewelry designed for eternity.
          </p>
        </div>
      `;

      try {
        await sendEmail({
          to: inquiry.email,
          subject: emailSubject,
          html: emailHtml,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error('Failed to send response email:', emailErr);
      }
    }

    // 2. Generate WhatsApp Deep Link to return in API response
    let whatsappLink = '';
    if (sendVia === 'WhatsApp' || sendVia === 'Both') {
      const cleanPhone = (inquiry.whatsappNumber || inquiry.phone).replace(/[^0-9]/g, '');
      const prefix = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone; // Fallback prefix for India if 10 digits
      const encodedMsg = encodeURIComponent(
        `*Goldsmiths Jewels - Response to Inquiry ${inquiry.inquiryId}*\n\n` +
        `Dear ${inquiry.customerName},\n\n` +
        `${responseMessage}\n\n` +
        `Product: ${inquiry.productName}\n` +
        `Status: Quoted`
      );
      whatsappLink = `https://wa.me/${prefix}?text=${encodedMsg}`;
    }

    res.json({
      success: true,
      data: inquiry,
      whatsappLink,
      emailSent,
      message: 'Inquiry response recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/admin/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry not found'));
    }

    await inquiry.deleteOne();

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's inquiries
// @route   GET /api/me/inquiries
// @access  Private
export const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [
        { customer: req.user._id },
        { email: req.user.email }
      ]
    })
      .populate('product', 'name price featuredImage images category sku')
      .sort('-createdAt');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};
