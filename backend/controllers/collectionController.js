import Collection from '../models/Collection.js';
import Product from '../models/Product.js';

const resolveCollectionProducts = async (collection) => {
  if (collection.productSource === 'manual') {
    const ids = collection.products.map(p => p.product).filter(Boolean);
    const productsMap = {};
    const foundProducts = await Product.find({ _id: { $in: ids }, status: 'active' }).lean();
    foundProducts.forEach(p => { productsMap[p._id.toString()] = p; });
    return collection.products
      .sort((a, b) => a.order - b.order)
      .map(item => productsMap[item.product?.toString()])
      .filter(Boolean);
  } else {
    const rule = collection.autoRule || {};
    const limit = rule.limit || 12;
    let filter = { status: 'active' };
    if (rule.filterBy === 'isFeatured') filter.isFeatured = true;
    else if (rule.filterBy === 'isBestSeller') filter.isBestSeller = true;
    else if (rule.filterBy === 'isNewArrival') filter.isNewArrival = true;
    else if (rule.filterBy === 'tag') filter.tags = rule.value;
    else if (rule.filterBy === 'category') filter.category = { $regex: rule.value, $options: 'i' };
    else if (rule.filterBy === 'occasion') filter.occasion = rule.value;
    else if (rule.filterBy === 'collectionName') filter.collectionName = rule.value;
    else if (rule.filterBy === 'metal') filter.metal = { $regex: rule.value, $options: 'i' };
    return await Product.find(filter).sort('-createdAt').limit(limit).lean();
  }
};

// @desc    Get all visible collections (public) with resolved products
// @route   GET /api/collections
// @access  Public
export const getCollections = async (req, res, next) => {
  try {
    const now = new Date();
    const filter = { isVisible: true, $or: [{ startDate: null }, { startDate: { $lte: now } }] };
    const endFilter = { $or: [{ endDate: null }, { endDate: { $gte: now } }] };
    const collections = await Collection.find({ ...filter, ...endFilter }).sort('sortOrder').lean();
    const resolved = await Promise.all(
      collections.map(async (col) => ({
        ...col,
        resolvedProducts: await resolveCollectionProducts(col),
      }))
    );
    res.json({ success: true, data: resolved });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all collections for admin (including hidden/scheduled)
// @route   GET /api/collections/admin
// @access  Admin
export const getAllCollectionsAdmin = async (req, res, next) => {
  try {
    const collections = await Collection.find({}).sort('sortOrder')
      .populate('products.product', 'name sku price images featuredImage category status')
      .lean();
    res.json({ success: true, data: collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collection by slug with resolved products
// @route   GET /api/collections/:slug
// @access  Public
export const getCollectionBySlug = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug }).lean();
    if (!collection) {
      res.status(404);
      return next(new Error('Collection not found'));
    }
    const resolvedProducts = await resolveCollectionProducts(collection);
    res.json({ success: true, data: { ...collection, resolvedProducts } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Admin
export const createCollection = async (req, res, next) => {
  try {
    const collection = new Collection(req.body);
    const saved = await collection.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Admin
export const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    if (!collection) { res.status(404); return next(new Error('Collection not found')); }
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Admin
export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) { res.status(404); return next(new Error('Collection not found')); }
    res.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign product to collection
// @route   POST /api/collections/:id/products
// @access  Admin
export const assignProductToCollection = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const collection = await Collection.findById(req.params.id);
    if (!collection) { res.status(404); return next(new Error('Collection not found')); }
    const alreadyExists = collection.products.some(p => p.product?.toString() === productId);
    if (!alreadyExists) {
      const maxOrder = collection.products.reduce((max, p) => Math.max(max, p.order || 0), -1);
      collection.products.push({ product: productId, order: maxOrder + 1 });
    }
    await collection.save();
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from collection
// @route   DELETE /api/collections/:id/products/:productId
// @access  Admin
export const removeProductFromCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) { res.status(404); return next(new Error('Collection not found')); }
    collection.products = collection.products.filter(p => p.product?.toString() !== req.params.productId);
    await collection.save();
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder products within a collection
// @route   PUT /api/collections/:id/reorder
// @access  Admin
export const reorderCollectionProducts = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // [{ productId, order }]
    const collection = await Collection.findById(req.params.id);
    if (!collection) { res.status(404); return next(new Error('Collection not found')); }
    orderedIds.forEach(({ productId, order }) => {
      const item = collection.products.find(p => p.product?.toString() === productId);
      if (item) item.order = order;
    });
    await collection.save();
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};
