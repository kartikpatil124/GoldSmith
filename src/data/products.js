// Product data for goldsmiths Jewels
export const products = [
  {
    id: 1, name: "Celestial Diamond Solitaire Ring", slug: "celestial-diamond-solitaire-ring",
    category: "Rings", subcategory: "Diamond Rings", sku: "LJ-RNG-001",
    price: 285000, originalPrice: 320000, discount: 11,
    metal: "18K Yellow Gold", purity: "18K / 750", weight: "4.2g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Round Brilliant", clarity: "VS1", color: "F", carat: "0.75ct" },
    size: "Available in sizes 5-12", finish: "High Polish",
    certification: "IGI Certified", hallmark: "BIS Hallmarked",
    description: "A breathtaking solitaire ring featuring a brilliant-cut natural diamond set in lustrous 18K yellow gold. The timeless design embodies elegance and sophistication, perfect for engagements or milestone celebrations.",
    careInstructions: "Clean with mild soap and warm water. Store separately to avoid scratches. Remove before applying lotions or perfumes.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.9, reviewCount: 127, inStock: true, badge: "trending",
    images: ["/products/ring1.jpg"], gender: "Women", occasion: "Engagement",
    style: "Classic", customizable: true
  },
  {
    id: 2, name: "Royal Emerald Drop Earrings", slug: "royal-emerald-drop-earrings",
    category: "Earrings", subcategory: "Gemstone Earrings", sku: "LJ-EAR-002",
    price: 165000, originalPrice: 195000, discount: 15,
    metal: "18K White Gold", purity: "18K / 750", weight: "6.8g",
    gemstone: "Emerald", gemstoneDetails: { type: "Natural Emerald", cut: "Pear", clarity: "AA", color: "Vivid Green", carat: "2.4ct total" },
    size: "Length: 3.5cm", finish: "Mirror Polish",
    certification: "GIA Certified", hallmark: "BIS Hallmarked",
    description: "Exquisite drop earrings featuring vivid green natural emeralds surrounded by a halo of brilliant diamonds, set in 18K white gold.",
    careInstructions: "Avoid exposure to harsh chemicals. Store in provided box.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.8, reviewCount: 89, inStock: true, badge: "sale",
    images: ["/products/earring1.jpg"], gender: "Women", occasion: "Party",
    style: "Luxury", customizable: false
  },
  {
    id: 3, name: "Maharani Bridal Necklace Set", slug: "maharani-bridal-necklace-set",
    category: "Necklaces", subcategory: "Bridal Sets", sku: "LJ-NCK-003",
    price: 850000, originalPrice: 950000, discount: 10,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "45g",
    gemstone: "Ruby & Diamond", gemstoneDetails: { type: "Natural Ruby & Diamond", cut: "Various", clarity: "VS", color: "Pigeon Blood Red", carat: "5.2ct total" },
    size: "Length: 18 inches", finish: "Traditional Matte & Polish",
    certification: "GIA Certified", hallmark: "BIS Hallmarked",
    description: "A magnificent bridal necklace set inspired by royal heritage, featuring natural rubies and diamonds in 22K gold with intricate traditional craftsmanship.",
    careInstructions: "Professional cleaning recommended. Store in anti-tarnish pouch.",
    deliveryEstimate: "7-10 business days", returnPolicy: "15-day easy returns",
    rating: 5.0, reviewCount: 64, inStock: true, badge: "new",
    images: ["/products/necklace1.jpg"], gender: "Women", occasion: "Bridal",
    style: "Traditional", customizable: true
  },
  {
    id: 4, name: "Infinity Diamond Tennis Bracelet", slug: "infinity-diamond-tennis-bracelet",
    category: "Bracelets", subcategory: "Diamond Bracelets", sku: "LJ-BRC-004",
    price: 425000, originalPrice: null, discount: 0,
    metal: "18K White Gold", purity: "18K / 750", weight: "12.5g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Round Brilliant", clarity: "VS2", color: "G", carat: "4.0ct total" },
    size: "7 inches (adjustable)", finish: "High Polish",
    certification: "IGI Certified", hallmark: "BIS Hallmarked",
    description: "A stunning tennis bracelet featuring a continuous line of perfectly matched round brilliant diamonds set in 18K white gold.",
    careInstructions: "Clean periodically with professional jewellery cleaner.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.7, reviewCount: 52, inStock: true, badge: null,
    images: ["/products/bracelet1.jpg"], gender: "Women", occasion: "Anniversary",
    style: "Classic", customizable: false
  },
  {
    id: 5, name: "Floral Gold Bangle Set", slug: "floral-gold-bangle-set",
    category: "Bangles", subcategory: "Gold Bangles", sku: "LJ-BNG-005",
    price: 185000, originalPrice: 210000, discount: 12,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "28g (set of 2)",
    gemstone: "None", gemstoneDetails: null,
    size: "2.4 inches diameter", finish: "Textured & Polish",
    certification: "N/A", hallmark: "BIS Hallmarked",
    description: "A pair of elegant 22K gold bangles with delicate floral motifs, combining traditional artistry with contemporary appeal.",
    careInstructions: "Wipe with soft cloth. Avoid contact with perfumes.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.6, reviewCount: 98, inStock: true, badge: "sale",
    images: ["/products/bangle1.jpg"], gender: "Women", occasion: "Daily Wear",
    style: "Traditional", customizable: false
  },
  {
    id: 6, name: "Serpentine Gold Chain", slug: "serpentine-gold-chain",
    category: "Chains", subcategory: "Gold Chains", sku: "LJ-CHN-006",
    price: 95000, originalPrice: null, discount: 0,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "12g",
    gemstone: "None", gemstoneDetails: null,
    size: "20 inches", finish: "High Polish",
    certification: "N/A", hallmark: "BIS Hallmarked",
    description: "A sleek serpentine chain crafted in 22K gold, perfect for everyday elegance or layering with pendants.",
    careInstructions: "Store flat to avoid kinking. Clean with soft cloth.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.5, reviewCount: 73, inStock: true, badge: null,
    images: ["/products/chain1.jpg"], gender: "Unisex", occasion: "Daily Wear",
    style: "Modern", customizable: false
  },
  {
    id: 7, name: "Sapphire Heart Pendant", slug: "sapphire-heart-pendant",
    category: "Pendants", subcategory: "Gemstone Pendants", sku: "LJ-PND-007",
    price: 78000, originalPrice: 92000, discount: 15,
    metal: "18K Rose Gold", purity: "18K / 750", weight: "3.8g",
    gemstone: "Blue Sapphire", gemstoneDetails: { type: "Natural Sapphire", cut: "Heart", clarity: "AAA", color: "Royal Blue", carat: "1.2ct" },
    size: "Pendant: 15mm", finish: "Mirror Polish",
    certification: "GIA Certified", hallmark: "BIS Hallmarked",
    description: "A romantic heart-shaped pendant featuring a natural blue sapphire set in warm 18K rose gold with diamond accents.",
    careInstructions: "Avoid water exposure. Clean with microfiber cloth.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.8, reviewCount: 41, inStock: true, badge: "trending",
    images: ["/products/pendant1.jpg"], gender: "Women", occasion: "Anniversary",
    style: "Romantic", customizable: true
  },
  {
    id: 8, name: "Diamond Nose Pin", slug: "diamond-nose-pin",
    category: "Nose Pins", subcategory: "Diamond Nose Pins", sku: "LJ-NSP-008",
    price: 22000, originalPrice: 28000, discount: 21,
    metal: "18K Yellow Gold", purity: "18K / 750", weight: "0.6g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Round Brilliant", clarity: "VS1", color: "E", carat: "0.10ct" },
    size: "3mm", finish: "High Polish",
    certification: "IGI Certified", hallmark: "BIS Hallmarked",
    description: "A delicate diamond nose pin set in 18K gold, adding a subtle sparkle to your everyday look.",
    careInstructions: "Handle with care. Store in padded box.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.9, reviewCount: 156, inStock: true, badge: "sale",
    images: ["/products/nosepin1.jpg"], gender: "Women", occasion: "Daily Wear",
    style: "Minimal", customizable: false
  },
  {
    id: 9, name: "Silver Anklet with Charms", slug: "silver-anklet-charms",
    category: "Anklets", subcategory: "Silver Anklets", sku: "LJ-ANK-009",
    price: 8500, originalPrice: null, discount: 0,
    metal: "925 Sterling Silver", purity: "925", weight: "8g",
    gemstone: "None", gemstoneDetails: null,
    size: "10 inches (adjustable)", finish: "Rhodium Plated",
    certification: "N/A", hallmark: "925 Stamped",
    description: "A charming sterling silver anklet with delicate charms, rhodium plated for lasting shine.",
    careInstructions: "Store in anti-tarnish pouch. Avoid moisture.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.4, reviewCount: 88, inStock: true, badge: null,
    images: ["/products/anklet1.jpg"], gender: "Women", occasion: "Daily Wear",
    style: "Bohemian", customizable: false
  },
  {
    id: 10, name: "Classic Men's Gold Signet Ring", slug: "mens-gold-signet-ring",
    category: "Rings", subcategory: "Men's Rings", sku: "LJ-RNG-010",
    price: 145000, originalPrice: null, discount: 0,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "10g",
    gemstone: "None", gemstoneDetails: null,
    size: "Available in sizes 8-14", finish: "Satin & Polish",
    certification: "N/A", hallmark: "BIS Hallmarked",
    description: "A bold and sophisticated signet ring in 22K gold, embodying timeless masculine elegance.",
    careInstructions: "Polish with soft cloth. Remove during heavy work.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.6, reviewCount: 34, inStock: true, badge: null,
    images: ["/products/mensring1.jpg"], gender: "Men", occasion: "Daily Wear",
    style: "Classic", customizable: true
  },
  {
    id: 11, name: "Princess Diamond Tiara", slug: "princess-diamond-tiara",
    category: "Bridal Sets", subcategory: "Bridal Accessories", sku: "LJ-BRD-011",
    price: 1250000, originalPrice: null, discount: 0,
    metal: "18K White Gold", purity: "18K / 750", weight: "35g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Marquise & Round", clarity: "VVS2", color: "D-E", carat: "8.5ct total" },
    size: "One Size (adjustable)", finish: "High Polish",
    certification: "GIA Certified", hallmark: "BIS Hallmarked",
    description: "A majestic bridal tiara adorned with marquise and round brilliant diamonds, crafted for the bride who deserves nothing less than royalty.",
    careInstructions: "Professional cleaning only. Store in custom case.",
    deliveryEstimate: "10-15 business days", returnPolicy: "By appointment only",
    rating: 5.0, reviewCount: 18, inStock: true, badge: "new",
    images: ["/products/tiara1.jpg"], gender: "Women", occasion: "Bridal",
    style: "Royal", customizable: true
  },
  {
    id: 12, name: "Kids' Gold Teddy Bear Pendant", slug: "kids-gold-teddy-pendant",
    category: "Kids", subcategory: "Kids Pendants", sku: "LJ-KDS-012",
    price: 18000, originalPrice: 22000, discount: 18,
    metal: "18K Yellow Gold", purity: "18K / 750", weight: "1.5g",
    gemstone: "None", gemstoneDetails: null,
    size: "Pendant: 12mm, Chain: 14 inches", finish: "Enamel & Polish",
    certification: "N/A", hallmark: "BIS Hallmarked",
    description: "An adorable teddy bear pendant in 18K gold with colorful enamel details, perfect for your little one.",
    careInstructions: "Gentle cleaning only. Avoid harsh chemicals on enamel.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.7, reviewCount: 45, inStock: true, badge: "trending",
    images: ["/products/kidspendant1.jpg"], gender: "Kids", occasion: "Gifting",
    style: "Playful", customizable: false
  },
  {
    id: 13, name: "Polki Diamond Choker Necklace", slug: "polki-diamond-choker",
    category: "Necklaces", subcategory: "Chokers", sku: "LJ-NCK-013",
    price: 575000, originalPrice: 650000, discount: 12,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "38g",
    gemstone: "Polki Diamond", gemstoneDetails: { type: "Polki Diamond", cut: "Uncut", clarity: "Natural", color: "Champagne", carat: "6ct total" },
    size: "Length: 14 inches", finish: "Kundan Setting",
    certification: "Certified", hallmark: "BIS Hallmarked",
    description: "A stunning Polki diamond choker featuring uncut diamonds in traditional Kundan setting, a masterpiece of Indian heritage jewellery.",
    careInstructions: "Handle with extreme care. Professional cleaning recommended.",
    deliveryEstimate: "7-10 business days", returnPolicy: "15-day easy returns",
    rating: 4.9, reviewCount: 31, inStock: true, badge: "new",
    images: ["/products/choker1.jpg"], gender: "Women", occasion: "Bridal",
    style: "Heritage", customizable: true
  },
  {
    id: 14, name: "Rose Gold Love Bracelet", slug: "rose-gold-love-bracelet",
    category: "Bracelets", subcategory: "Gold Bracelets", sku: "LJ-BRC-014",
    price: 68000, originalPrice: null, discount: 0,
    metal: "18K Rose Gold", purity: "18K / 750", weight: "8g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Round", clarity: "VS2", color: "G", carat: "0.3ct total" },
    size: "7 inches", finish: "High Polish",
    certification: "IGI Certified", hallmark: "BIS Hallmarked",
    description: "A romantic rose gold bracelet with diamond-studded love motifs, symbolizing eternal affection.",
    careInstructions: "Avoid chlorine and harsh chemicals. Polish regularly.",
    deliveryEstimate: "3-5 business days", returnPolicy: "15-day easy returns",
    rating: 4.8, reviewCount: 67, inStock: true, badge: "trending",
    images: ["/products/rosebracelet1.jpg"], gender: "Women", occasion: "Anniversary",
    style: "Romantic", customizable: false
  },
  {
    id: 15, name: "Pearl & Gold Jhumka Earrings", slug: "pearl-gold-jhumka",
    category: "Earrings", subcategory: "Jhumkas", sku: "LJ-EAR-015",
    price: 125000, originalPrice: 145000, discount: 14,
    metal: "22K Yellow Gold", purity: "22K / 916", weight: "14g",
    gemstone: "Pearl", gemstoneDetails: { type: "South Sea Pearl", cut: "Round", clarity: "AAA", color: "Cream", carat: "N/A" },
    size: "Length: 5cm", finish: "Antique Finish",
    certification: "Certified Pearls", hallmark: "BIS Hallmarked",
    description: "Traditional Jhumka earrings in 22K gold adorned with lustrous South Sea pearls, blending heritage craftsmanship with timeless elegance.",
    careInstructions: "Keep pearls away from acids and perfumes. Wipe with damp cloth.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.7, reviewCount: 82, inStock: true, badge: "sale",
    images: ["/products/jhumka1.jpg"], gender: "Women", occasion: "Festive",
    style: "Traditional", customizable: false
  },
  {
    id: 16, name: "Platinum Wedding Band", slug: "platinum-wedding-band",
    category: "Rings", subcategory: "Wedding Bands", sku: "LJ-RNG-016",
    price: 95000, originalPrice: null, discount: 0,
    metal: "950 Platinum", purity: "950", weight: "6g",
    gemstone: "Diamond", gemstoneDetails: { type: "Natural Diamond", cut: "Round", clarity: "VS1", color: "F", carat: "0.15ct total" },
    size: "Available in sizes 5-13", finish: "Satin & Polish",
    certification: "IGI Certified", hallmark: "Pt 950 Stamped",
    description: "A refined platinum wedding band with channel-set diamonds, symbolizing your eternal commitment with understated luxury.",
    careInstructions: "Platinum develops a natural patina. Professional polishing restores shine.",
    deliveryEstimate: "5-7 business days", returnPolicy: "15-day easy returns",
    rating: 4.9, reviewCount: 55, inStock: true, badge: null,
    images: ["/products/weddingband1.jpg"], gender: "Unisex", occasion: "Wedding",
    style: "Classic", customizable: true
  }
];

export const categories = [
  { id: 1, name: "Rings", slug: "rings", icon: "💍", count: 245, image: "/categories/rings.jpg" },
  { id: 2, name: "Earrings", slug: "earrings", icon: "✨", count: 312, image: "/categories/earrings.jpg" },
  { id: 3, name: "Necklaces", slug: "necklaces", icon: "📿", count: 198, image: "/categories/necklaces.jpg" },
  { id: 4, name: "Bracelets", slug: "bracelets", icon: "⭐", count: 156, image: "/categories/bracelets.jpg" },
  { id: 5, name: "Bangles", slug: "bangles", icon: "🔅", count: 134, image: "/categories/bangles.jpg" },
  { id: 6, name: "Chains", slug: "chains", icon: "🔗", count: 87, image: "/categories/chains.jpg" },
  { id: 7, name: "Pendants", slug: "pendants", icon: "💎", count: 203, image: "/categories/pendants.jpg" },
  { id: 8, name: "Nose Pins", slug: "nose-pins", icon: "✧", count: 76, image: "/categories/nosepins.jpg" },
  { id: 9, name: "Anklets", slug: "anklets", icon: "🌙", count: 54, image: "/categories/anklets.jpg" },
  { id: 10, name: "Bridal Sets", slug: "bridal-sets", icon: "👑", count: 89, image: "/categories/bridal.jpg" },
  { id: 11, name: "Men's Jewellery", slug: "mens", icon: "🏆", count: 112, image: "/categories/mens.jpg" },
  { id: 12, name: "Kids Jewellery", slug: "kids", icon: "🌟", count: 67, image: "/categories/kids.jpg" },
  { id: 13, name: "Custom Jewellery", slug: "custom", icon: "🎨", count: 0, image: "/categories/custom.jpg" },
  { id: 14, name: "Gift Jewellery", slug: "gifts", icon: "🎁", count: 145, image: "/categories/gifts.jpg" },
];

export const reviews = [
  { id: 1, name: "Priya Sharma", rating: 5, text: "Absolutely stunning craftsmanship! The diamond ring exceeded all my expectations. The attention to detail is remarkable.", date: "2025-12-15", verified: true, product: "Celestial Diamond Solitaire Ring" },
  { id: 2, name: "Rahul Mehta", rating: 5, text: "Bought the Maharani set for my wife's wedding anniversary. She was speechless! Premium quality and beautiful packaging.", date: "2025-11-28", verified: true, product: "Maharani Bridal Necklace Set" },
  { id: 3, name: "Ananya Patel", rating: 5, text: "The emerald earrings are a masterpiece. The color is so vivid and the setting is flawless. Will definitely order again!", date: "2025-12-02", verified: true, product: "Royal Emerald Drop Earrings" },
  { id: 4, name: "Vikram Singh", rating: 4, text: "Great quality signet ring. Solid gold, perfect weight, and excellent finish. Highly recommend for men's jewellery.", date: "2025-10-18", verified: true, product: "Classic Men's Gold Signet Ring" },
  { id: 5, name: "Meera Reddy", rating: 5, text: "The Polki choker is a dream come true! Wore it at my daughter's wedding and received so many compliments.", date: "2025-11-05", verified: true, product: "Polki Diamond Choker Necklace" },
  { id: 6, name: "Arjun Kapoor", rating: 5, text: "Exceptional service and product quality. The packaging alone made it feel so special. My fiancée loved her ring!", date: "2025-12-20", verified: true, product: "Celestial Diamond Solitaire Ring" },
];

export const blogPosts = [
  { id: 1, title: "The Ultimate Guide to Choosing Your Engagement Ring", slug: "engagement-ring-guide", excerpt: "Everything you need to know about selecting the perfect symbol of your love.", category: "Guides", readTime: "8 min", date: "2025-12-10" },
  { id: 2, title: "Understanding Gold Purity: 14K vs 18K vs 22K", slug: "gold-purity-guide", excerpt: "Learn the differences between gold karats and find what's right for you.", category: "Education", readTime: "5 min", date: "2025-11-25" },
  { id: 3, title: "Diamond Buying Guide: The 4 Cs Explained", slug: "diamond-buying-guide", excerpt: "Cut, Clarity, Color, Carat — master the fundamentals of diamond selection.", category: "Education", readTime: "10 min", date: "2025-11-15" },
  { id: 4, title: "Bridal Jewellery Trends 2026", slug: "bridal-trends-2026", excerpt: "Discover the hottest bridal jewellery trends from the latest collections.", category: "Trends", readTime: "6 min", date: "2025-12-05" },
  { id: 5, title: "How to Care for Your Gold Jewellery", slug: "gold-care-tips", excerpt: "Essential tips to keep your precious gold pieces looking brand new.", category: "Care", readTime: "4 min", date: "2025-10-20" },
  { id: 6, title: "The Meaning Behind Popular Gemstones", slug: "gemstone-meanings", excerpt: "Explore the symbolism and significance of your favorite gemstones.", category: "Education", readTime: "7 min", date: "2025-10-10" },
];

export const faqs = [
  { category: "Orders", items: [
    { q: "How do I place an order?", a: "Browse our collection, select your desired product, choose the size/options, and click 'Add to Cart'. Proceed to checkout, fill in your details, and complete payment." },
    { q: "Can I modify my order after placing it?", a: "Orders can be modified within 2 hours of placement. Please contact our support team immediately." },
    { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking link via email and SMS. You can also track from your account dashboard." }
  ]},
  { category: "Payments", items: [
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, popular wallets, and Cash on Delivery for select locations." },
    { q: "Is my payment information secure?", a: "Absolutely. We use 256-bit SSL encryption and PCI DSS compliant payment gateways to ensure your data is fully protected." },
    { q: "Do you offer EMI options?", a: "Yes, we offer no-cost EMI on select banks for orders above ₹25,000. Check available options at checkout." }
  ]},
  { category: "Shipping & Delivery", items: [
    { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at an additional charge. Custom orders may take 10-15 business days." },
    { q: "Do you ship internationally?", a: "Yes, we ship to select countries. International shipping takes 10-15 business days. Duties and taxes may apply." },
    { q: "Is shipping insured?", a: "All orders are fully insured during transit. We use tamper-proof packaging for complete security." }
  ]},
  { category: "Returns & Exchange", items: [
    { q: "What is your return policy?", a: "We offer a 15-day return policy for unused, undamaged items in original packaging. Custom-made pieces are non-returnable." },
    { q: "How do I initiate a return?", a: "Log into your account, go to 'My Orders', select the item, and click 'Request Return'. Our team will arrange a secure pickup." },
    { q: "Can I exchange my jewellery?", a: "Yes, exchanges are accepted within 30 days for a different size, metal color, or product of equal or higher value." }
  ]},
  { category: "Certification & Authenticity", items: [
    { q: "Are your products hallmarked?", a: "Yes, all our gold and platinum jewellery is BIS Hallmarked, guaranteeing purity and authenticity." },
    { q: "Do diamonds come with certificates?", a: "All diamonds above 0.3ct come with IGI or GIA certification, verifying cut, clarity, color, and carat weight." },
    { q: "How can I verify authenticity?", a: "Each product comes with a certificate of authenticity. You can verify hallmark numbers on the BIS website." }
  ]},
  { category: "Custom Orders", items: [
    { q: "Can I get custom jewellery made?", a: "Absolutely! Share your design idea, preferred metal, gemstones, and budget. Our artisans will create a bespoke piece just for you." },
    { q: "How long does a custom order take?", a: "Custom orders typically take 2-4 weeks depending on complexity. You'll receive regular updates throughout the process." },
    { q: "Can I see a 3D preview before ordering?", a: "Yes, for custom orders above ₹50,000, we provide a 3D CAD rendering for your approval before production begins." }
  ]}
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};
