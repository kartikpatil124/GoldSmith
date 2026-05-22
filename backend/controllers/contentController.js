import Content from '../models/Content.js';

// @desc    Get all content sections
// @route   GET /api/content
// @access  Public
export const getAllContent = async (req, res, next) => {
  try {
    const content = await Content.find({});
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content by section
// @route   GET /api/content/:section
// @access  Public
export const getContentBySection = async (req, res, next) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) {
      // Return empty content with the section name
      return res.json({ success: true, data: { section: req.params.section, title: '', content: '', items: [], isActive: true } });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update content section
// @route   PUT /api/content/:section
// @access  Private/Admin
export const upsertContent = async (req, res, next) => {
  try {
    const { title, subtitle, content, items, isActive, metadata } = req.body;

    const updated = await Content.findOneAndUpdate(
      { section: req.params.section },
      {
        section: req.params.section,
        title,
        subtitle,
        content,
        items,
        isActive: isActive !== undefined ? isActive : true,
        metadata
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete content section
// @route   DELETE /api/content/:section
// @access  Private/Admin
export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findOneAndDelete({ section: req.params.section });
    if (!content) {
      res.status(404);
      return next(new Error('Content section not found'));
    }
    res.json({ success: true, message: 'Content section removed' });
  } catch (error) {
    next(error);
  }
};
