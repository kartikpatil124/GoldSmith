import PageContent from '../models/PageContent.js';

// @desc    Get all content sections for a page
// @route   GET /api/page-content?pageKey=bridal
// @access  Public
export const getPageContent = async (req, res, next) => {
  try {
    const { pageKey } = req.query;
    const filter = { isActive: true };
    if (pageKey) filter.pageKey = pageKey;
    const content = await PageContent.find(filter).sort('sectionKey').lean();
    // Return as a map for easy frontend access
    const contentMap = {};
    content.forEach(c => { contentMap[c.sectionKey] = c; });
    res.json({ success: true, data: contentMap, list: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all page content for admin (all pages)
// @route   GET /api/page-content/all
// @access  Admin
export const getAllPageContent = async (req, res, next) => {
  try {
    const content = await PageContent.find({}).sort('pageKey sectionKey').lean();
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single page section
// @route   GET /api/page-content/section?pageKey=home&sectionKey=hero
// @access  Public
export const getPageSection = async (req, res, next) => {
  try {
    const { pageKey, sectionKey } = req.query;
    const content = await PageContent.findOne({ pageKey, sectionKey }).lean();
    if (!content) {
      return res.json({ success: true, data: { pageKey, sectionKey, title: '', subtitle: '', body: '', isActive: true } });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a page section
// @route   PUT /api/page-content
// @access  Admin
export const upsertPageSection = async (req, res, next) => {
  try {
    const { pageKey, sectionKey, ...rest } = req.body;
    if (!pageKey || !sectionKey) {
      res.status(400);
      return next(new Error('pageKey and sectionKey are required'));
    }
    const content = await PageContent.findOneAndUpdate(
      { pageKey, sectionKey },
      { $set: { pageKey, sectionKey, ...rest } },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a page section
// @route   DELETE /api/page-content
// @access  Admin
export const deletePageSection = async (req, res, next) => {
  try {
    const { pageKey, sectionKey } = req.body;
    const content = await PageContent.findOneAndDelete({ pageKey, sectionKey });
    if (!content) { res.status(404); return next(new Error('Section not found')); }
    res.json({ success: true, message: 'Section deleted' });
  } catch (error) {
    next(error);
  }
};
