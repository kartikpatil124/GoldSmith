import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const images = [
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e', // Diamond ring
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9', // Ring box
  'https://images.unsplash.com/photo-1543294001-f7cbfe92237e', // Diamond ring spark
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071', // Gold vintage ring
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0', // Diamond bands
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f', // Gemstone gold ring
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', // Minimalist ring
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908', // Emerald ring
  'https://images.unsplash.com/photo-1635767798638-3e25273a8236', // Gold earrings
  'https://images.unsplash.com/photo-1630019852942-f89202989a59', // Diamond drops
  'https://images.unsplash.com/photo-1596944229400-2e57ca967462', // Ruby drop earrings
  'https://images.unsplash.com/photo-1588444839799-eaa4344ebd19', // Silver dangles
  'https://images.unsplash.com/photo-1615655404746-8f030dbbca27', // Gold studs
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e', // Gold chains & necklace
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1', // Diamond choker
  'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40', // Emerald necklace
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', // Luxury diamond necklace
  'https://images.unsplash.com/photo-1602752275313-477eaabc497c', // Pearl necklace
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a', // Tennis bracelet
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0', // Gold bracelet
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed', // Charm bracelets
  'https://images.unsplash.com/photo-1611956551065-ec7c7d42cf38'  // Classic necklace model
];

const getUnsplashUrl = (index) => {
  const baseImg = images[index % images.length];
  return `${baseImg}?w=800&auto=format&fit=crop&q=80&sig=${index}`;
};

const categories = [
  'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bangles', 
  'Chains', 'Pendants', 'Nose Pins', 'Anklets', 'Bridal Sets', 'Kids'
];

const metals = [
  '18K Yellow Gold', '18K White Gold', '18K Rose Gold', 
  '22K Yellow Gold', '950 Platinum', '925 Sterling Silver'
];

const purityMap = {
  '18K Yellow Gold': '18K / 750',
  '18K White Gold': '18K / 750',
  '18K Rose Gold': '18K / 750',
  '22K Yellow Gold': '22K / 916',
  '950 Platinum': '950 Platinum',
  '925 Sterling Silver': '925 Sterling Silver'
};

const gemstoneTypes = ['Diamond', 'Emerald', 'Ruby', 'Blue Sapphire', 'Pearl', 'None'];

const gemstoneDetails = {
  'Diamond': { type: 'Natural Diamond', cut: 'Round Brilliant', color: 'G-H', clarity: 'VS2', shape: 'Round', count: '1', carat: '0.45ct' },
  'Emerald': { type: 'Natural Zambian Emerald', cut: 'Oval Cut', color: 'Vivid Green', clarity: 'SI1', shape: 'Oval', count: '1', carat: '1.2ct' },
  'Ruby': { type: 'Natural Burmese Ruby', cut: 'Pear Cut', color: 'Pigeon Blood Red', clarity: 'VS1', shape: 'Pear', count: '1', carat: '0.85ct' },
  'Blue Sapphire': { type: 'Ceylon Blue Sapphire', cut: 'Cushion Cut', color: 'Royal Blue', clarity: 'VVS2', shape: 'Cushion', count: '1', carat: '1.5ct' },
  'Pearl': { type: 'South Sea Pearl', cut: 'Round Cabochon', color: 'Creamy White', clarity: 'AAA', shape: 'Round', count: '1', carat: 'N/A' },
  'None': null
};

// Generate 50 realistic products
const generateProducts = (adminUserId) => {
  const seedList = [];
  
  for (let i = 1; i <= 50; i++) {
    const category = categories[(i - 1) % categories.length];
    const metal = metals[i % metals.length];
    const gemstone = gemstoneTypes[(i * 3) % gemstoneTypes.length];
    
    let basePrice = 30000 + ((i * 17) % 20) * 15000;
    if (category === 'Bridal Sets') {
      basePrice = 350000 + ((i * 3) % 5) * 120000;
    } else if (category === 'Necklaces') {
      basePrice = 120000 + ((i * 2) % 5) * 45000;
    } else if (category === 'Nose Pins') {
      basePrice = 8000 + ((i * 5) % 4) * 4000;
    } else if (category === 'Anklets' || category === 'Kids') {
      basePrice = 5000 + ((i * 7) % 5) * 3500;
    }
    
    const salePrice = Math.round(basePrice * 0.9);
    const sku = `LJ-${category.substring(0, 3).toUpperCase()}-${100 + i}`;
    const name = `${gemstone !== 'None' ? gemstone + ' ' : ''}${metal.replace('950 ', '').replace('925 ', '')} ${category.substring(0, category.length - (category.endsWith('s') && !category.endsWith('ss') ? 1 : 0))} ${i}`;
    
    // Customize product names to make them look incredibly realistic and premium
    let customName = name;
    if (category === 'Rings') {
      const types = ['Solitaire Ring', 'Eternity Band', 'Halo Engagement Ring', 'Vintage Marquise Ring', 'Classic Signet Ring'];
      customName = `${gemstone !== 'None' ? gemstone : 'Elegant'} ${types[i % types.length]}`;
    } else if (category === 'Earrings') {
      const types = ['Drop Earrings', 'Stud Earrings', 'Chandeliers', 'Hoops', 'Jhumkas'];
      customName = `${gemstone !== 'None' ? gemstone : 'Lustrous'} ${types[i % types.length]}`;
    } else if (category === 'Necklaces') {
      const types = ['Choker Necklace', 'Lariat Pendant Necklace', 'Princess Strand', 'Layered Collar Set'];
      customName = `${gemstone !== 'None' ? gemstone : 'Imperial'} ${types[i % types.length]}`;
    } else if (category === 'Bridal Sets') {
      const types = ['Royal Heritage Set', 'Eternal Majesty Bridal Suite', 'Vows & Veil Diamond Set', 'Nuptial Blossom Gold Set'];
      customName = `${types[i % types.length]}`;
    } else if (category === 'Bracelets') {
      const types = ['Tennis Bracelet', 'Charm Bracelet', 'Link Chain Bracelet', 'Delicate Cuff'];
      customName = `${gemstone !== 'None' ? gemstone : 'Handcrafted'} ${types[i % types.length]}`;
    } else if (category === 'Bangles') {
      customName = `${gemstone !== 'None' ? gemstone : 'Intricately Carved'} Bangle Set`;
    } else if (category === 'Chains') {
      const types = ['Serpentine Chain', 'Spiga Wheat Chain', 'Belcher Cable Chain', 'Box Link Chain'];
      customName = `${metal.replace('950 ', '')} ${types[i % types.length]}`;
    } else if (category === 'Pendants') {
      customName = `${gemstone !== 'None' ? gemstone : 'Ornate'} Statement Pendant`;
    } else if (category === 'Nose Pins') {
      customName = `Dainty ${gemstone !== 'None' ? gemstone : 'Gold'} Nose Stud`;
    } else if (category === 'Anklets') {
      customName = `Bohemian Sterling ${gemstone !== 'None' ? gemstone : 'Silver'} Anklet`;
    } else if (category === 'Kids') {
      const designs = ['Teddy Bear Pendant', 'Star Studs', 'Enamel Butterfly Bracelet', 'Cute Kitten Anklet'];
      customName = `Little Pixie ${designs[i % designs.length]}`;
    }
    
    // Add Roman Numerals or fine extensions to avoid duplicates
    const finalName = `${customName} - ${['Aura', 'Elysian', 'Nova', 'Seraphina', 'Eterno', 'Belle', 'Goldsmiths'][i % 7]} Edition`;
    const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const occasions = ['Bridal', 'Engagement', 'Wedding', 'Anniversary', 'Daily Wear', 'Party', 'Festive', 'Gifting'];
    const occasion = category === 'Bridal Sets' ? 'Bridal' : occasions[i % occasions.length];
    
    const isFeatured = i % 7 === 0;
    const isBestSeller = i % 5 === 0;
    const isNewArrival = i % 4 === 0;
    
    // YouTube video links to rotate (YouTube fine-jewelry reviews / visuals)
    const ytVideos = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=K4DyBUG242c',
      'https://www.youtube.com/watch?v=2K4V5DkUo34',
      'https://www.youtube.com/watch?v=kYJ6g8V2fGo',
      'https://www.youtube.com/watch?v=L9rD6_sD5_g'
    ];
    
    const video = i % 3 === 0 ? ytVideos[i % ytVideos.length] : '';

    const img1 = getUnsplashUrl(i);
    const img2 = getUnsplashUrl(i + 50);
    const img3 = getUnsplashUrl(i + 100);

    const size = category === 'Rings' ? 'Size 6, 7, 8, 9 available' : 
                 category === 'Earrings' || category === 'Pendants' || category === 'Nose Pins' ? 'One Size' :
                 category === 'Necklaces' ? '18 inches (adjustable)' :
                 category === 'Bracelets' ? '7.5 inches' :
                 category === 'Bangles' ? '2.4, 2.6, 2.8 inches' : 'Standard Length';
                 
    seedList.push({
      user: adminUserId,
      name: finalName,
      sku,
      slug,
      barcode: `BAR-${sku}`,
      brand: 'goldsmiths Jewels',
      category,
      subcategory: `${category} Collection`,
      collectionName: i % 3 === 0 ? 'Royal Heritage' : (i % 3 === 1 ? 'Eternal Brilliance' : 'Modern Minimalist'),
      productType: category === 'Rings' ? 'Solitaire' : 'Classic',
      gender: category === 'Kids' ? 'Kids' : (i % 8 === 0 ? 'Men' : 'Women'),
      occasion,
      style: ['Classic', 'Modern', 'Traditional', 'Contemporary', 'Minimalist', 'Vintage'][i % 6],
      isFeatured,
      isBestSeller,
      isNewArrival,
      isPinned: i % 15 === 0,
      pinnedOrder: i % 15,
      status: 'active',
      badge: isFeatured ? 'trending' : (isBestSeller ? 'best' : (isNewArrival ? 'new' : '')),
      tags: [category.toLowerCase(), metal.toLowerCase(), occasion.toLowerCase()].filter(Boolean),
      
      price: basePrice,
      salePrice: salePrice,
      discountPrice: salePrice,
      discountPercentage: 10,
      makingCharges: Math.round(basePrice * 0.12),
      taxRate: 3,
      
      countInStock: 5 + (i % 15),
      lowStockThreshold: 3,
      availabilityStatus: 'in_stock',
      
      metal,
      purity: purityMap[metal] || '18K / 750',
      karat: metal.includes('18K') ? '18K' : (metal.includes('22K') ? '22K' : 'N/A'),
      grossWeight: `${(3 + (i % 12) * 1.5).toFixed(1)}g`,
      netWeight: `${(2.8 + (i % 12) * 1.45).toFixed(1)}g`,
      weight: `${(3 + (i % 12) * 1.5).toFixed(1)}g`,
      dimensions: 'Standard Fine Jewellery Specifications',
      finish: ['High Polish', 'Matte', 'Satin', 'Antique'][i % 4],
      certification: ['GIA Certified', 'IGI Certified', 'SGL Certified', 'BIS Hallmarked'][i % 4],
      hallmark: 'BIS Hallmarked 916',
      
      gemstoneDetails: gemstoneDetails[gemstone],
      
      size,
      ringSize: category === 'Rings' ? '7' : '',
      braceletSize: category === 'Bracelets' ? '7.5' : '',
      necklaceLength: category === 'Necklaces' ? '18' : '',
      adjustable: i % 2 === 0,
      
      description: `A stunning showcase of master craftsmanship, this ${finalName} represents the height of luxury. Handcrafted with the finest ${metal} and highlighting premium ${gemstone !== 'None' ? gemstone : 'metalwork'}, it is a signature piece for collectors of fine jewellery. Each curve and setting is carefully scrutinized to achieve absolute perfection, ensuring it shines brightly for generations to come.`,
      shortDescription: `Gorgeous ${finalName} handcrafted in premium ${metal} with meticulous attention to detail.`,
      careInstructions: 'Clean gently using warm soapy water and a soft-bristled brush. Store in a soft pouch away from direct sunlight and harsh chemicals.',
      deliveryEstimate: '5-7 business days',
      returnPolicy: '15-day hassle-free returns with fully insured pick-up.',
      warranty: 'Lifetime Buyback & 1-Year Product Warranty',
      customizable: i % 2 === 0,
      
      metaTitle: `Buy ${finalName} | goldsmiths Jewels`,
      metaDescription: `Shop the premium ${finalName} online at goldsmiths Jewels. BIS Hallmarked, Certified diamonds, and free insured delivery across India.`,
      keywords: [category, metal, gemstone, 'fine jewellery'].filter(Boolean),
      
      featuredImage: img1,
      images: [img1, img2, img3],
      video,
      
      rating: 4.5 + (i % 6) * 0.1,
      numReviews: 12 + (i % 80)
    });
  }
  
  return seedList;
};

const runSeeder = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to host: ${conn.connection.host}`);
    
    // Auto-seed admin user first (if it's not present)
    let adminUser = await User.findOne({ role: { $in: ['Super Admin', 'Admin'] } });
    if (!adminUser) {
      console.log('No Admin user found. Auto-creating admin@goldsmithsjewels.com...');
      adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@goldsmithsjewels.com',
        password: 'password123',
        role: 'Super Admin',
        isVerified: true
      });
      console.log('Admin user seeded successfully!');
    }
    
    console.log('Deleting existing products in MongoDB...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products.`);
    
    console.log('Generating 50 realistic premium jewellery products...');
    const seededProducts = generateProducts(adminUser._id);
    
    console.log('Inserting products into database...');
    const insertedResult = await Product.insertMany(seededProducts);
    console.log(`Successfully seeded ${insertedResult.length} premium jewellery products across all 11 categories!`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed with error: ${error.message}`);
    process.exit(1);
  }
};

runSeeder();
