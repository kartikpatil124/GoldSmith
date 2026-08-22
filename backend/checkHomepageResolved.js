import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import HomepageConfig from './models/HomepageConfig.js';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

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

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected!');
    let config = await HomepageConfig.findOne({ configKey: 'main' }).lean();
    if (!config) {
      console.log('No homepage config in DB, using defaults.');
      config = {
        sections: [
          { sectionKey: 'featured_creations', title: 'Featured Creations', subtitle: 'Timeless Treasures', order: 0, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isFeatured', value: 'true', limit: 8 }, bgStyle: 'cream', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] }
        ]
      };
    }
    for (const section of config.sections) {
      console.log('=== Section:', section.title, '===');
      const products = await resolveProducts(section);
      console.log('Resolved', products.length, 'products:');
      products.forEach(p => {
        console.log('- Name:', p.name);
        console.log('  Featured Image:', p.featuredImage);
        console.log('  Images:', p.images);
        console.log('  Price:', p.price);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
