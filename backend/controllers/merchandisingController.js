import HomepageConfig from '../models/HomepageConfig.js';
import Product from '../models/Product.js';

// Default sections structure
const DEFAULT_SECTIONS = [
  { sectionKey: 'featured_creations', title: 'Featured Creations', subtitle: 'Timeless Treasures', order: 0, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isFeatured', value: 'true', limit: 8 }, bgStyle: 'cream', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] },
  { sectionKey: 'new_arrivals', title: 'New Arrivals', subtitle: 'Just Landed', order: 1, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isNewArrival', value: 'true', limit: 8 }, bgStyle: 'white', showViewAll: true, viewAllLink: '/shop?sort=newest', maxProducts: 8, products: [] },
  { sectionKey: 'best_sellers', title: 'Best Sellers', subtitle: 'Most Loved Pieces', order: 2, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isBestSeller', value: 'true', limit: 8 }, bgStyle: 'cream', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] },
  { sectionKey: 'bridal_spotlight', title: 'Bridal Spotlight', subtitle: 'Where Forever Begins', order: 3, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'occasion', value: 'Bridal', limit: 4 }, bgStyle: 'dark', showViewAll: true, viewAllLink: '/bridal', maxProducts: 4, products: [] },
  { sectionKey: 'trending', title: 'Trending Now', subtitle: 'What Everyone is Wearing', order: 4, isVisible: false, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'badge', value: 'trending', limit: 8 }, bgStyle: 'white', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] },
  { sectionKey: 'editors_picks', title: "Editor's Picks", subtitle: 'Curated by Our Experts', order: 5, isVisible: false, layout: 'grid-3', productSource: 'manual', autoRule: { filterBy: 'isFeatured', value: 'true', limit: 6 }, bgStyle: 'cream', showViewAll: false, viewAllLink: '/shop', maxProducts: 6, products: [] },
];

// Resolve products for a section (auto or manual)
const resolveProducts = async (section) => {
  if (section.productSource === 'manual') {
    const ids = section.products.map(p => p.product).filter(Boolean);
    const productsMap = {};
    const foundProducts = await Product.find({ _id: { $in: ids }, status: 'active' }).lean();
    foundProducts.forEach(p => { productsMap[p._id.toString()] = p; });
    return section.products
      .sort((a, b) => a.order - b.order)
      .map(item => productsMap[item.product?.toString()])
      .filter(Boolean)
      .slice(0, section.maxProducts || 8);
  } else {
    // Auto rule
    const rule = section.autoRule || {};
    const limit = rule.limit || section.maxProducts || 8;
    let filter = { status: 'active' };
    if (rule.filterBy === 'isFeatured') filter.isFeatured = true;
    else if (rule.filterBy === 'isBestSeller') filter.isBestSeller = true;
    else if (rule.filterBy === 'isNewArrival') filter.isNewArrival = true;
    else if (rule.filterBy === 'tag') filter.tags = rule.value;
    else if (rule.filterBy === 'category') filter.category = { $regex: rule.value, $options: 'i' };
    else if (rule.filterBy === 'occasion') filter.occasion = rule.value;
    else if (rule.filterBy === 'collectionName') filter.collectionName = rule.value;
    else if (rule.filterBy === 'metal') filter.metal = { $regex: rule.value, $options: 'i' };
    else if (rule.filterBy === 'badge') filter.badge = rule.value;
    return await Product.find(filter).sort('-createdAt').limit(limit).lean();
  }
};

// @desc    Get homepage config with resolved products
// @route   GET /api/merchandising/homepage
// @access  Public
export const getHomepageConfig = async (req, res, next) => {
  try {
    let config = await HomepageConfig.findOne({ configKey: 'main' }).lean();
    if (!config) {
      // Return default structure without saving
      const defaultConfig = {
        configKey: 'main',
        sections: DEFAULT_SECTIONS,
        heroTitle: 'Elegance Forged in Eternity',
        heroSubtitle: 'Discover our exclusive collection of handcrafted fine jewellery',
        heroCTAText: 'Explore Collection',
        heroCTALink: '/shop',
        heroSecondaryCTAText: 'Bespoke Design',
        heroSecondaryCTALink: '/custom-order',
      };
      // Resolve products for each default section
      const resolvedSections = await Promise.all(
        defaultConfig.sections.map(async (section) => ({
          ...section,
          resolvedProducts: await resolveProducts(section),
        }))
      );
      return res.json({ success: true, data: { ...defaultConfig, sections: resolvedSections } });
    }
    // Resolve products for each section
    const resolvedSections = await Promise.all(
      (config.sections || []).map(async (section) => ({
        ...section,
        resolvedProducts: await resolveProducts(section),
      }))
    );
    res.json({ success: true, data: { ...config, sections: resolvedSections } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get raw homepage config (for admin editing — no product resolution)
// @route   GET /api/merchandising/homepage/raw
// @access  Admin
export const getHomepageConfigRaw = async (req, res, next) => {
  try {
    let config = await HomepageConfig.findOne({ configKey: 'main' })
      .populate('sections.products.product', 'name sku price images featuredImage category status')
      .lean();
    if (!config) {
      config = { configKey: 'main', sections: DEFAULT_SECTIONS, heroTitle: 'Elegance Forged in Eternity', heroSubtitle: '', heroCTAText: 'Explore Collection', heroCTALink: '/shop', heroSecondaryCTAText: 'Bespoke Design', heroSecondaryCTALink: '/custom-order' };
    }
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Save full homepage config
// @route   PUT /api/merchandising/homepage
// @access  Admin
export const updateHomepageConfig = async (req, res, next) => {
  try {
    const { sections, heroTitle, heroSubtitle, heroCTAText, heroCTALink, heroSecondaryCTAText, heroSecondaryCTALink } = req.body;
    const config = await HomepageConfig.findOneAndUpdate(
      { configKey: 'main' },
      { $set: { sections, heroTitle, heroSubtitle, heroCTAText, heroCTALink, heroSecondaryCTAText, heroSecondaryCTALink } },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to a homepage section
// @route   POST /api/merchandising/homepage/assign
// @access  Admin
export const assignProductToSection = async (req, res, next) => {
  try {
    const { sectionKey, productId } = req.body;
    let config = await HomepageConfig.findOne({ configKey: 'main' });
    if (!config) {
      config = new HomepageConfig({ configKey: 'main', sections: DEFAULT_SECTIONS });
    }
    const section = config.sections.find(s => s.sectionKey === sectionKey);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    const alreadyExists = section.products.some(p => p.product?.toString() === productId);
    if (!alreadyExists) {
      const maxOrder = section.products.reduce((max, p) => Math.max(max, p.order || 0), -1);
      section.products.push({ product: productId, order: maxOrder + 1 });
    }
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from a homepage section
// @route   DELETE /api/merchandising/homepage/remove
// @access  Admin
export const removeProductFromSection = async (req, res, next) => {
  try {
    const { sectionKey, productId } = req.body;
    const config = await HomepageConfig.findOne({ configKey: 'main' });
    if (!config) return res.status(404).json({ success: false, message: 'Config not found' });
    const section = config.sections.find(s => s.sectionKey === sectionKey);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    section.products = section.products.filter(p => p.product?.toString() !== productId);
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder products within a section
// @route   PUT /api/merchandising/homepage/reorder
// @access  Admin
export const reorderSectionProducts = async (req, res, next) => {
  try {
    // orderedIds: [{ productId, order }]
    const { sectionKey, orderedIds } = req.body;
    const config = await HomepageConfig.findOne({ configKey: 'main' });
    if (!config) return res.status(404).json({ success: false, message: 'Config not found' });
    const section = config.sections.find(s => s.sectionKey === sectionKey);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    orderedIds.forEach(({ productId, order }) => {
      const item = section.products.find(p => p.product?.toString() === productId);
      if (item) item.order = order;
    });
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};
