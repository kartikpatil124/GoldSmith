import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const metal = req.query.metal ? { metal: { $regex: req.query.metal, $options: 'i' } } : {};
    
    // Additional filters can be added here (price range, gemstone, etc.)

    const filter = { ...keyword, ...category, ...metal };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sort || '-createdAt');

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    let product;

    if (isObjectId) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name || 'Sample name',
      price: req.body.price || 0,
      user: req.user._id,
      sku: req.body.sku || `SKU-${Date.now()}`,
      slug: req.body.slug || `sample-product-${Date.now()}`,
      featuredImage: req.body.featuredImage || '/images/sample.jpg',
      category: req.body.category || 'Sample category',
      metal: req.body.metal || 'Sample metal',
      countInStock: req.body.countInStock || 0,
      numReviews: 0,
      description: req.body.description || 'Sample description',
      ...req.body
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        return next(new Error('Product already reviewed'));
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};
