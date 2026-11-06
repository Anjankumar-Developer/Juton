/**
 * JUTON Wholesale Product Catalog & Master Registry
 * Crafted Naturally. Delivered Across India.
 * 
 * Centralized JavaScript product data store.
 * Supports all 6 required categories:
 * 1. Shopping Bags
 * 2. Tote Bags
 * 3. Gift Bags
 * 4. Promotional Bags
 * 5. Custom Printed Bags
 * 6. Corporate Bags
 */

export const CATEGORIES = [
  'All Categories',
  'Shopping Bags',
  'Tote Bags',
  'Gift Bags',
  'Promotional Bags',
  'Custom Printed Bags',
  'Corporate Bags'
];

export const DEMO_PRICING_DISCLAIMER =
  'Sample wholesale prices and tier discounts are demonstration data until verified corporate trade pricing is configured.';

export const collectionsData = [
  {
    id: 'shopping-bags',
    name: 'Shopping Bags',
    category: 'Shopping Bags',
    tagline: 'High-volume biodegradable grocery & retail carriers',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    itemCount: '18 Silhouettes',
    moq: '100 pcs',
    startingPrice: 115,
    description: 'Sturdy gusseted shopping totes reinforced with organic cotton webbing handles. Coated with plant-based moisture barrier for fresh market produce.'
  },
  {
    id: 'tote-bags',
    name: 'Tote Bags',
    category: 'Tote Bags',
    tagline: 'Refined lifestyle & daily carryalls with organic trims',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1000&q=80',
    itemCount: '24 Silhouettes',
    moq: '50 pcs',
    startingPrice: 165,
    description: 'Fashion-forward natural totes featuring canvas contrast pockets, magnetic snap closures, and dual-shoulder straps. Loved by boutique lifestyle brands.'
  },
  {
    id: 'gift-bags',
    name: 'Gift Bags',
    category: 'Gift Bags',
    tagline: 'Artisanal gift packaging for festive, weddings & vineyards',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
    itemCount: '15 Silhouettes',
    moq: '75 pcs',
    startingPrice: 95,
    description: 'Single and dual bottle wine bags with cane handles, plus drawstring festive gift pouches with metallic zari threads and botanical trims.'
  },
  {
    id: 'promotional-bags',
    name: 'Promotional Bags',
    category: 'Promotional Bags',
    tagline: 'Cost-effective high-impact carriers for trade expos & campaigns',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1000&q=80',
    itemCount: '16 Silhouettes',
    moq: '100 pcs',
    startingPrice: 85,
    description: 'Lightweight durable jute and juco carriers engineered for high-volume brand giveaways, marathons, university summits, and nationwide eco campaigns.'
  },
  {
    id: 'custom-printed-bags',
    name: 'Custom Printed Bags',
    category: 'Custom Printed Bags',
    tagline: 'Precision screen print, metallic foil deboss & woven badges',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
    itemCount: 'Bespoke Orders',
    moq: '100 pcs',
    startingPrice: 140,
    description: 'Transform your brand identity into walking sustainable billboards. Eco water-based screen printing up to 6 Pantone colors with pin-sharp clarity.'
  },
  {
    id: 'corporate-bags',
    name: 'Corporate Bags',
    category: 'Corporate Bags',
    tagline: 'Conference folios, seminar sleeves & executive carryalls',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    itemCount: '12 Silhouettes',
    moq: '50 pcs',
    startingPrice: 220,
    description: 'Engineered for summits, delegates, and corporate onboarding kits. Structured jute canvas padded for 14-inch laptops and document storage.'
  }
];

export const products = [
  // 1. SHOPPING BAGS
  {
    id: 'the-grand-market-tote',
    name: 'The Grand Market Shopping Tote',
    category: 'Shopping Bags',
    collectionId: 'shopping-bags',
    badge: 'Best Seller',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 2500,
    dateAdded: '2026-01-15',
    moq: 100,
    startingPrice: 145,
    priceINR: 145,
    priceUSD: 3.50,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 165, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 145, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 125, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 4.00 },
      { min: 100, max: 499, label: '100–499 units', price: 3.50 },
      { min: 500, max: null, label: '500+ units', price: 2.95 }
    ],
    material: '100% Raw Golden Bengal Jute (Unbleached)',
    fabricWeight: '340 GSM Heavyweight Golden Jute',
    dimensions: '42 cm (W) x 36 cm (H) x 16 cm (D)',
    handleType: 'Padded Organic Cotton Rope (14" Drop)',
    closure: 'Open Top with Reinforced Lip',
    lining: 'Plant-Based Biodegradable Starch Coat (Moisture Resistant)',
    certifications: ['100% Biodegradable', 'GOTS Cotton Handles', 'Plastic-Free packaging'],
    leadTime: '4 - 7 Days across India',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Bleached Ivory', hex: '#F7F5EF', border: '#E8DDCA' },
      { name: 'Olive Green', hex: '#68745A', border: '#3D4935' },
      { name: 'Charcoal Black', hex: '#252720', border: '#3D4935' }
    ],
    description: 'Engineered specifically for premier organic grocery chains, supermarkets, and upscale department stores. Features reinforced 4-point cross-box handle stitching that carries over 20kg of produce without sagging.',
    relatedProductIds: ['heavy-duty-spillproof-market-carrier', 'artisan-canvas-trim-tote', 'pantone-bespoke-printed-tote']
  },
  {
    id: 'heavy-duty-spillproof-market-carrier',
    name: 'Heavy-Duty Spillproof Market Carrier',
    category: 'Shopping Bags',
    collectionId: 'shopping-bags',
    badge: 'High Capacity',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 1800,
    dateAdded: '2026-02-10',
    moq: 100,
    startingPrice: 155,
    priceINR: 155,
    priceUSD: 3.75,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 175, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 155, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 135, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 4.25 },
      { min: 100, max: 499, label: '100–499 units', price: 3.75 },
      { min: 500, max: null, label: '500+ units', price: 3.20 }
    ],
    material: 'Natural Bengal Jute with Cornstarch Lamination',
    fabricWeight: '380 GSM Heavy Structural Fiber',
    dimensions: '45 cm (W) x 38 cm (H) x 20 cm (D)',
    handleType: 'Dual Heavy Cotton Webbing with Jute Overlay',
    closure: 'Open Top with Structured Stiffened Base',
    lining: 'Wipeable Compostable Starch Inner Liner',
    certifications: ['Food Safe Grade', '100% Recyclable', 'Load Tested 25kg'],
    leadTime: '5 - 8 Days across India',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Deep Olive', hex: '#3D4935', border: '#252720' },
      { name: 'Jute Brown', hex: '#A88B66', border: '#68745A' }
    ],
    description: 'Our maximum volume commercial shopping tote with an expanded 20cm gusset and wipeable plant-based starch barrier. Ideal for chilled dairy, farm produce, and heavy retail items.',
    relatedProductIds: ['the-grand-market-tote', 'marathon-promotional-drawstring']
  },

  // 2. TOTE BAGS
  {
    id: 'artisan-canvas-trim-tote',
    name: 'Artisan Contrast Canvas Tote',
    category: 'Tote Bags',
    collectionId: 'tote-bags',
    badge: 'Trending',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 1200,
    dateAdded: '2026-01-20',
    moq: 50,
    startingPrice: 195,
    priceINR: 195,
    priceUSD: 4.60,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 220, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 195, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 175, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 5.20 },
      { min: 100, max: 499, label: '100–499 units', price: 4.60 },
      { min: 500, max: null, label: '500+ units', price: 4.00 }
    ],
    material: 'Natural Golden Jute with 10oz Cotton Canvas Outer Pocket',
    fabricWeight: '380 GSM High-Density Weave',
    dimensions: '38 cm (W) x 40 cm (H) x 12 cm (D)',
    handleType: 'Natural Canvas Shoulder Straps (28 cm drop)',
    closure: 'Brass Magnetic Button',
    lining: 'Unbleached Cotton Canvas Inner Slip Pocket',
    certifications: ['Zero Toxic Dyes', 'OEKO-TEX Certified Canvas', 'Fair Wages Mill'],
    leadTime: '5 - 8 Days across India',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural / Ivory Pocket', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Olive / Natural Pocket', hex: '#68745A', border: '#3D4935' },
      { name: 'Charcoal / Ivory Pocket', hex: '#252720', border: '#3D4935' },
      { name: 'Jute Brown / Earth', hex: '#A88B66', border: '#68745A' }
    ],
    description: 'A stylish everyday tote blending raw golden jute fibers with clean off-white canvas front pocket for effortless logo debossing or embroidery. Loved by lifestyle boutiques and design studios.',
    relatedProductIds: ['the-grand-market-tote', 'executive-conference-folio', 'pantone-bespoke-printed-tote']
  },
  {
    id: 'scandinavian-minimalist-tote',
    name: 'Scandinavian Minimalist Slender Tote',
    category: 'Tote Bags',
    collectionId: 'tote-bags',
    badge: 'New Arrival',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 1500,
    dateAdded: '2026-02-18',
    moq: 50,
    startingPrice: 180,
    priceINR: 180,
    priceUSD: 4.25,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 205, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 180, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 160, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 4.85 },
      { min: 100, max: 499, label: '100–499 units', price: 4.25 },
      { min: 500, max: null, label: '500+ units', price: 3.75 }
    ],
    material: 'Refined Fine-Warp Juco (70% Jute / 30% Cotton)',
    fabricWeight: '320 GSM Refined Weave',
    dimensions: '35 cm (W) x 42 cm (H) x 8 cm (D)',
    handleType: 'Tubular Cotton Cord Handles',
    closure: 'Minimalist Brass Hook & Eye',
    lining: 'Light Unbleached Muslin',
    certifications: ['Handloom Loomed', 'Plastic-Free', 'Sedex Audited'],
    leadTime: '4 - 7 Days across India',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Warm Ivory', hex: '#F7F5EF', border: '#E8DDCA' },
      { name: 'Natural Beige', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Olive Green', hex: '#68745A', border: '#3D4935' }
    ],
    description: 'Architectural vertical silhouette woven with a softer juco blend that eliminates roughness while retaining 100% natural jute strength. Perfect for museum shops, bookshops, and architecture practices.',
    relatedProductIds: ['artisan-canvas-trim-tote', 'executive-conference-folio']
  },

  // 3. GIFT BAGS
  {
    id: 'sommelier-cane-wine-carrier',
    name: 'Sommelier Dual Wine Carrier',
    category: 'Gift Bags',
    collectionId: 'gift-bags',
    badge: 'Luxury Gift',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 800,
    dateAdded: '2026-01-10',
    moq: 75,
    startingPrice: 235,
    priceINR: 235,
    priceUSD: 5.40,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 260, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 235, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 210, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 6.00 },
      { min: 100, max: 499, label: '100–499 units', price: 5.40 },
      { min: 500, max: null, label: '500+ units', price: 4.80 }
    ],
    material: '400 GSM Rigid Structured Golden Jute with Bamboo',
    fabricWeight: '400 GSM Rigid Woven Jute',
    dimensions: '20 cm (W) x 36 cm (H) x 10 cm (D)',
    handleType: 'Artisanal Natural Bamboo / Cane Handle',
    closure: 'Fold-over flap with wooden toggle',
    lining: 'Padded Collapsible Jute Partition (Fits 2 Bottles)',
    certifications: ['FSC Certified Cane', 'Plastic-Free', 'Eco Packaging'],
    leadTime: '5 - 9 Days across India',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Olive Green', hex: '#68745A', border: '#3D4935' },
      { name: 'Charcoal Black', hex: '#252720', border: '#3D4935' }
    ],
    description: 'Crafted for vineyards, gourmet hampers, weddings, and festive corporate gifting. Keeps two standard bottles safely separated with a cushioned interior partition.',
    relatedProductIds: ['botanica-drawstring-gift-pouch', 'artisan-canvas-trim-tote']
  },
  {
    id: 'botanica-drawstring-gift-pouch',
    name: 'Botanica Festive Drawstring Sacks',
    category: 'Gift Bags',
    collectionId: 'gift-bags',
    badge: 'Festive Pack',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 3000,
    dateAdded: '2026-01-08',
    moq: 150,
    startingPrice: 85,
    priceINR: 85,
    priceUSD: 2.10,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 98, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 85, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 72, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 2.45 },
      { min: 100, max: 499, label: '100–499 units', price: 2.10 },
      { min: 500, max: null, label: '500+ units', price: 1.75 }
    ],
    material: 'Softened Natural Golden Jute with Zari Thread Trim',
    fabricWeight: '240 GSM Softened Natural Jute',
    dimensions: '22 cm (W) x 28 cm (H)',
    handleType: 'Dual Natural Jute & Cotton Cord with Wooden Beads',
    closure: 'Smooth Double Drawstring Pull',
    lining: 'Breathable Unlined Natural Fiber',
    certifications: ['100% Compostable in 60 Days', 'Zero Plastic', 'Artisan Hand-tied'],
    leadTime: '4 - 7 Days across India',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Warm Ivory', hex: '#F7F5EF', border: '#E8DDCA' },
      { name: 'Terracotta', hex: '#C27D56', border: '#A88B66' }
    ],
    description: 'A festive packaging staple for artisan confections, organic spices, Ayurvedic cosmetics, and Diwali/New Year hampers. Handcrafted wooden bead pulls add an heirloom touch.',
    relatedProductIds: ['sommelier-cane-wine-carrier', 'marathon-promotional-drawstring']
  },

  // 4. PROMOTIONAL BAGS
  {
    id: 'marathon-promotional-drawstring',
    name: 'GreenRun Eco Promotional Backpack',
    category: 'Promotional Bags',
    collectionId: 'promotional-bags',
    badge: 'High Volume Pick',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 5000,
    dateAdded: '2026-02-22',
    moq: 100,
    startingPrice: 95,
    priceINR: 95,
    priceUSD: 2.30,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 110, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 95, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 80, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 2.70 },
      { min: 100, max: 499, label: '100–499 units', price: 2.30 },
      { min: 500, max: null, label: '500+ units', price: 1.95 }
    ],
    material: 'Lightweight Golden Juco with Reinforced Eyelets',
    fabricWeight: '260 GSM Flexible Natural Blend',
    dimensions: '34 cm (W) x 44 cm (H)',
    handleType: 'Double Cotton Drawstring Backpack Cords (8mm)',
    closure: 'Cinch Top with Brass Reinforced Eyelets',
    lining: 'Unlined Breathable Fiber',
    certifications: ['Carbon Neutral Transit', 'Sweatshop Free', 'Zero Plastic Cords'],
    leadTime: '4 - 6 Days across India',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Olive Green', hex: '#68745A', border: '#3D4935' },
      { name: 'Charcoal Black', hex: '#252720', border: '#3D4935' }
    ],
    description: 'Engineered for sporting events, college fests, sustainability runs, and corporate wellness initiatives. Provides a massive printable billboard surface for promotional sponsors.',
    relatedProductIds: ['pantone-bespoke-printed-tote', 'botanica-drawstring-gift-pouch']
  },
  {
    id: 'eco-expo-flat-carrier',
    name: 'Expo Delegate Flat Document Carrier',
    category: 'Promotional Bags',
    collectionId: 'promotional-bags',
    badge: 'Budget Eco',
    isBestSeller: false,
    isNew: false,
    inStock: true,
    stockQuantity: 4000,
    dateAdded: '2026-01-25',
    moq: 100,
    startingPrice: 85,
    priceINR: 85,
    priceUSD: 2.05,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 98, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 85, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 70, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 2.40 },
      { min: 100, max: 499, label: '100–499 units', price: 2.05 },
      { min: 500, max: null, label: '500+ units', price: 1.70 }
    ],
    material: 'Natural 280 GSM Woven Jute with Cut-Out Handles',
    fabricWeight: '280 GSM Flat Weave Jute',
    dimensions: '32 cm (W) x 38 cm (H) (Flat Profile)',
    handleType: 'Die-Cut D-Handle with Reinforced Hem',
    closure: 'Open Top',
    lining: 'Unlined Natural Starch Treated',
    certifications: ['Zero Waste Pattern', '100% Compostable', 'Plastic Free'],
    leadTime: '3 - 5 Days across India',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Bleached Ivory', hex: '#F7F5EF', border: '#E8DDCA' }
    ],
    description: 'The ultra-cost-effective alternative to single-use convention tote bags. Fits A4 brochures, product samples, and conference schedules perfectly with zero plastic compromise.',
    relatedProductIds: ['marathon-promotional-drawstring', 'the-grand-market-tote']
  },

  // 5. CUSTOM PRINTED BAGS
  {
    id: 'pantone-bespoke-printed-tote',
    name: 'Pantone Precision Screened Tote',
    category: 'Custom Printed Bags',
    collectionId: 'custom-printed-bags',
    badge: 'Custom Logo',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 3500,
    dateAdded: '2026-01-12',
    moq: 100,
    startingPrice: 155,
    priceINR: 155,
    priceUSD: 3.75,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 175, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 155, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 135, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 4.25 },
      { min: 100, max: 499, label: '100–499 units', price: 3.75 },
      { min: 500, max: null, label: '500+ units', price: 3.25 }
    ],
    material: '320 GSM Fine Golden Fiber with Calendered Smooth Face',
    fabricWeight: '320 GSM Fine Golden Fiber',
    dimensions: '36 cm (W) x 38 cm (H) x 10 cm (D)',
    handleType: 'Color-Matched Cotton Webbing (60 cm)',
    closure: 'Open Top',
    lining: 'Lightweight Natural Starch Laminate',
    certifications: ['Water-Based Inks', 'Zero Heavy Metals', 'Vegan Certified'],
    leadTime: '7 - 10 Days across India (Includes Proofing)',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Base', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Warm Ivory Base', hex: '#F7F5EF', border: '#E8DDCA' },
      { name: 'Olive Green Base', hex: '#68745A', border: '#3D4935' },
      { name: 'Midnight Charcoal Base', hex: '#252720', border: '#3D4935' }
    ],
    description: 'Our benchmark customized bag for corporate events, retail merchandising, and brand launches. Our high-mesh screens ensure razor-sharp registration for intricate brand logos up to 6 colors.',
    relatedProductIds: ['the-grand-market-tote', 'metallic-foil-luxury-carrier', 'executive-conference-folio']
  },
  {
    id: 'metallic-foil-luxury-carrier',
    name: 'Metallic Gold & Copper Foil Debossed Tote',
    category: 'Custom Printed Bags',
    collectionId: 'custom-printed-bags',
    badge: 'Luxury Finish',
    isBestSeller: false,
    isNew: true,
    inStock: false,
    stockQuantity: 0,
    dateAdded: '2026-02-05',
    moq: 100,
    startingPrice: 210,
    priceINR: 210,
    priceUSD: 4.95,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 240, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 210, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 185, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 5.60 },
      { min: 100, max: 499, label: '100–499 units', price: 4.95 },
      { min: 500, max: null, label: '500+ units', price: 4.35 }
    ],
    material: 'Dense 400 GSM Calendered Jute with Metallic Foil Deboss',
    fabricWeight: '400 GSM Ultra-Dense Weave',
    dimensions: '40 cm (W) x 34 cm (H) x 14 cm (D)',
    handleType: 'Braided Vegan Leatherette or Cotton Rope',
    closure: 'Antique Brass Snap Button',
    lining: 'Satin Finish Cotton Twill',
    certifications: ['Non-Tarnishing Foil', 'Made-to-Order Custom Run', 'Fair Trade Mill'],
    leadTime: '8 - 12 Days across India',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Charcoal with Gold Foil', hex: '#252720', border: '#3D4935' },
      { name: 'Natural with Copper Foil', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Deep Olive with Gold Foil', hex: '#3D4935', border: '#252720' }
    ],
    description: 'Elevated corporate packaging featuring heated brass-plate metallic foil debossing in royal gold, rose copper, or satin silver. Tailor-made for luxury jewelers, premium hospitality, and milestone summits.',
    relatedProductIds: ['pantone-bespoke-printed-tote', 'executive-conference-folio']
  },

  // 6. CORPORATE BAGS
  {
    id: 'executive-conference-folio',
    name: 'Executive Jute Seminar Folio',
    category: 'Corporate Bags',
    collectionId: 'corporate-bags',
    badge: 'Corporate Pick',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 950,
    dateAdded: '2026-01-05',
    moq: 50,
    startingPrice: 265,
    priceINR: 265,
    priceUSD: 6.20,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 295, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 265, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 235, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 6.90 },
      { min: 100, max: 499, label: '100–499 units', price: 6.20 },
      { min: 500, max: null, label: '500+ units', price: 5.45 }
    ],
    material: '450 GSM Heavy Structured Jute Canvas with Cotton Padding',
    fabricWeight: '450 GSM Heavy Structured Jute Canvas',
    dimensions: '37 cm (W) x 27 cm (H) x 5 cm (D)',
    handleType: 'Top Grab Handle with Vegan Leather Wrap',
    closure: 'Concealed Magnetic Brass Snaps',
    lining: 'Quilted Organic Cotton Interior with Pen Slots & Laptop Sleeve (Fits 14")',
    certifications: ['PETA Approved Vegan', 'Fair Trade Sourced', 'ISO 9001 Factory'],
    leadTime: '6 - 9 Days across India',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Charcoal Black', hex: '#252720', border: '#3D4935' },
      { name: 'Deep Olive', hex: '#3D4935', border: '#252720' }
    ],
    description: 'Designed specifically for annual general meetings, luxury hospitality welcome kits, and executive training conferences. Built with structured internal padding to cradle 14-inch laptops and legal documents.',
    relatedProductIds: ['oxford-laptop-briefcase-tote', 'pantone-bespoke-printed-tote', 'artisan-canvas-trim-tote']
  },
  {
    id: 'oxford-laptop-briefcase-tote',
    name: 'Oxford Structured Laptop Briefcase Tote',
    category: 'Corporate Bags',
    collectionId: 'corporate-bags',
    badge: 'Executive Grade',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 600,
    dateAdded: '2026-02-14',
    moq: 50,
    startingPrice: 320,
    priceINR: 320,
    priceUSD: 7.50,
    pricingTiersINR: [
      { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 350, isBase: true },
      { min: 100, max: 499, label: '100–499 units (Discounted)', price: 320, isDiscounted: true },
      { min: 500, max: null, label: '500+ units (Custom quotation)', price: 285, isCustomQuote: true }
    ],
    pricingTiersUSD: [
      { min: 50, max: 99, label: '50–99 units', price: 8.20 },
      { min: 100, max: 499, label: '100–499 units', price: 7.50 },
      { min: 500, max: null, label: '500+ units', price: 6.70 }
    ],
    material: 'Laminated 450 GSM Golden Jute with Full Zipper Top',
    fabricWeight: '450 GSM Laminated Executive Jute',
    dimensions: '42 cm (W) x 32 cm (H) x 12 cm (D)',
    handleType: 'Heavy-Duty Webbing Handles + Detachable Shoulder Strap',
    closure: 'Smooth Brass YKK Zipper Closure',
    lining: 'Padded Organic Cotton with Dedicated 15.6" Tech Sleeve',
    certifications: ['Heavy Duty Tested', 'Recycled Brass Hardware', 'Zero Plastic Polyfill'],
    leadTime: '6 - 10 Days across India',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Charcoal Black', hex: '#252720', border: '#3D4935' },
      { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
      { name: 'Deep Olive', hex: '#3D4935', border: '#252720' }
    ],
    description: 'The definitive executive bag for modern enterprises seeking an authentic plastic-free alternative to nylon messenger bags. Featuring a dedicated padded sleeve for 15.6-inch laptops, metal stud feet, and full zippered closure.',
    relatedProductIds: ['executive-conference-folio', 'artisan-canvas-trim-tote']
  }
];

// Helper Functions
export function getProductById(id) {
  if (!id) return null;
  return products.find((p) => p.id === id) || null;
}

export function getRelatedProducts(productId, limit = 3) {
  const current = getProductById(productId);
  if (!current) return products.slice(0, limit);

  // First try explicitly related products
  if (current.relatedProductIds && current.relatedProductIds.length > 0) {
    const matched = current.relatedProductIds
      .map((relId) => products.find((p) => p.id === relId))
      .filter(Boolean);
    if (matched.length >= limit) {
      return matched.slice(0, limit);
    }
  }

  // Fallback: items in the same category, excluding current
  const sameCategory = products.filter(
    (p) => p.category === current.category && p.id !== current.id
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Fallback: other products
  const remaining = products.filter(
    (p) => p.id !== current.id && !sameCategory.some((sc) => sc.id === p.id)
  );
  return [...sameCategory, ...remaining].slice(0, limit);
}

export function filterAndSortProducts({
  category = 'All Categories',
  searchQuery = '',
  sortBy = 'featured',
  availability = 'all'
} = {}) {
  let result = [...products];

  // 1. Category Filter
  if (category && category !== 'All Categories' && category !== 'All') {
    result = result.filter(
      (p) =>
        p.category.toLowerCase() === category.toLowerCase() ||
        p.collectionId === category.toLowerCase().replace(/\s+/g, '-')
    );
  }

  // 2. Availability Filter
  if (availability === 'in-stock') {
    result = result.filter((p) => p.inStock);
  } else if (availability === 'made-to-order') {
    result = result.filter((p) => !p.inStock);
  }

  // 3. Search Query Filter
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.fabricWeight.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(q)))
    );
  }

  // 4. Sorting
  switch (sortBy) {
    case 'bestsellers':
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      break;
    case 'price-asc':
      result.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case 'price-desc':
      result.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case 'moq-asc':
      result.sort((a, b) => a.moq - b.moq);
      break;
    case 'featured':
    default:
      result.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      });
      break;
  }

  return result;
}

export const whyChooseJutonPillars = [
  {
    id: 'sustainable-materials',
    title: 'Sustainable Materials',
    subtitle: '100% Biodegradable & Compostable',
    description: 'Sourced from organic, rainfall-fed golden jute cultivations in West Bengal. Zero harmful synthetic chemical bleaches or non-degradable petroleum microplastics.',
    stat: '100% Plant Fiber',
    icon: 'Leaf'
  },
  {
    id: 'bulk-manufacturing',
    title: 'Bulk Manufacturing',
    subtitle: 'Scalable Mill Production',
    description: 'From trial batches of 50 pieces to containerized shipments of 100,000+ units, our automated precision cutting and dedicated tailoring lines deliver consistent quality on schedule.',
    stat: '150,000+ Bags/Mo',
    icon: 'Factory'
  },
  {
    id: 'custom-branding',
    title: 'Custom Branding',
    subtitle: 'Tailored to Your Identity',
    description: 'Full-spectrum customization: precision screen printing, gold/copper metallic foil stamping, custom woven hem labels, laser-engraved wood badges, and Pantone-matched handles.',
    stat: 'Up to 6 Colors',
    icon: 'Sparkles'
  },
  {
    id: 'quality-craftsmanship',
    title: 'Quality Craftsmanship',
    subtitle: 'Heirloom Grade Durability',
    description: 'Reinforced 4-point cross box stitching on all stress zones, heavy-duty 340–450 GSM fiber weaves, and plant-derived spill-proof linings rated to carry 20kg+ easily.',
    stat: '20kg+ Load Tested',
    icon: 'ShieldCheck'
  },
  {
    id: 'india-wide-shipping',
    title: 'India-Wide Shipping',
    subtitle: 'Reliable Surface & Air Logistics',
    description: 'Seamless door-to-door delivery across all Indian tier 1, 2, and 3 cities including Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, and Pune.',
    stat: '28 States Covered',
    icon: 'Truck'
  }
];

export const brandStoryContent = {
  eyebrow: 'Artisanal Heritage & Clean Commerce',
  heading: 'Honoring Bengal’s Golden Fiber with Modern Editorial Design',
  quote: '"We founded JUTON on a straightforward conviction: Indian businesses shouldn’t have to choose between luxury aesthetic appeal and genuine ecological responsibility."',
  paragraphs: [
    'For centuries, jute — respectfully known as the "Golden Fiber" — has been cultivated in the fertile delta plains of the Ganges. It is one of nature’s most self-sustaining crops: requiring zero chemical fertilizers, surviving on seasonal monsoon rainfall, and consuming more carbon dioxide than typical timber forests.',
    'At JUTON, we elevate this humble agricultural fiber into luxury corporate and retail packaging. By collaborating directly with master weaver cooperatives and ethical mills, we guarantee fair living wages, eliminate middlemen markups, and craft products engineered to replace thousands of single-use poly bags.'
  ],
  stats: [
    { label: 'Single-Use Bags Saved', value: '4.8M+' },
    { label: 'Active Business Clients', value: '1,200+' },
    { label: 'Artisan Families Supported', value: '650+' }
  ],
  image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
};
