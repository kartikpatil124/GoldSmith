import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import Banner from './models/Banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 14 verified-working Unsplash jewelry URLs (tested 200 OK via HEAD requests)
const WORKING_IMAGES = [
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&auto=format&fit=crop&q=80',
];

const getImg = (index) => WORKING_IMAGES[index % WORKING_IMAGES.length];

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB Connected!');

    // ============================================================
    // 1. Update all products with verified working images
    // ============================================================
    const products = await Product.find({}).lean();
    console.log(`Found ${products.length} products to update...`);

    let updatedCount = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const img1 = getImg(i);
      const img2 = getImg(i + 1);
      const img3 = getImg(i + 2);

      await Product.findByIdAndUpdate(p._id, {
        $set: {
          featuredImage: img1,
          images: [img1, img2, img3],
        }
      });
      updatedCount++;
      if (updatedCount % 10 === 0) {
        console.log(`  Updated ${updatedCount}/${products.length} products...`);
      }
    }
    console.log(`✅ Updated ${updatedCount} products with verified images!`);

    // ============================================================
    // 2. Seed the hero banner if it doesn't exist
    // ============================================================
    const existingBanner = await Banner.findOne({ pageKey: 'home', position: 'hero' });
    if (!existingBanner) {
      await Banner.create({
        title: 'Elegance Forged in Eternity',
        subtitle: 'Welcome to Goldsmiths',
        body: 'Discover our exclusive collection of handcrafted fine jewellery',
        ctaText: 'Explore Collection',
        ctaLink: '/shop',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&auto=format&fit=crop&q=80',
        pageKey: 'home',
        position: 'hero',
        isActive: true,
        order: 0,
      });
      console.log('✅ Hero banner created!');
    } else {
      // Update existing banner with a good image
      await Banner.findByIdAndUpdate(existingBanner._id, {
        $set: {
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&auto=format&fit=crop&q=80',
          isActive: true,
        }
      });
      console.log('✅ Hero banner updated with working image!');
    }

    // ============================================================
    // 3. Also seed a shop banner
    // ============================================================
    const shopBanner = await Banner.findOne({ pageKey: 'shop', position: 'hero' });
    if (!shopBanner) {
      await Banner.create({
        title: 'Shop Our Collection',
        subtitle: 'Fine Jewellery',
        ctaText: 'Browse All',
        ctaLink: '/shop',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1920&auto=format&fit=crop&q=80',
        pageKey: 'shop',
        position: 'hero',
        isActive: true,
        order: 0,
      });
      console.log('✅ Shop banner created!');
    }

    console.log('\n🎉 All done! Images fixed and banners seeded.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

fixImages();
