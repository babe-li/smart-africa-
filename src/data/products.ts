import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'tz-phone-1',
    name: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)',
    swahiliName: 'Simu ya Kisasa ya Samsung S24 Ultra',
    category: 'Electronics & Gadgets',
    priceTzs: 3450000,
    originalPriceTzs: 3800000,
    rating: 4.9,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Dar Tech Emporium (Official Samsung Partner)',
      location: 'Posta, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Genuine factory-sealed smartphone with 24-month East African warranty. Features Snapdragon 8 Gen 3 for Galaxy, 200MP camera, built-in S-Pen, and hardware-level Knox security enclave.',
    features: [
      'Hardware Knox Vault Security & Biometric Sensor',
      'Dual SIM + eSIM (Supports Vodacom, Tigo, Airtel 5G)',
      '5000mAh Battery with 45W Fast Charging',
      'Verified by TCRA (Tanzania Communications Regulatory Authority)'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-1',
    name: 'SunPower Hybrid Solar Inverter System 3kVA + 200Ah Gel Battery',
    swahiliName: 'Mfumo Kamili wa Umeme wa Jua nyumbani',
    category: 'Solar & Power Solutions',
    priceTzs: 1850000,
    originalPriceTzs: 2100000,
    rating: 4.8,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1509391365360-bbbi007?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kilimanjaro Green Energy Ltd',
      location: 'Arusha CBD',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Reliable backup solar power package designed for homes and small businesses in East Africa. Pure sine wave output protects sensitive electronics against power grid fluctuations.',
    features: [
      'Automatic transfer switch (<10ms cutoff)',
      'Includes smart mobile app energy monitoring',
      'Surge protection & lightning arrestor integrated',
      '3-Year full manufacturer warranty in Tanzania'
    ],
    securityVerified: true
  },
  {
    id: 'tz-coffee-1',
    name: 'Kilimanjaro Peaberry Arabica Coffee Beans (1kg Premium Roast)',
    swahiliName: 'Kahawa Halisi ya Kilimanjaro Peaberry',
    category: 'Agriculture & Coffee',
    priceTzs: 65000,
    originalPriceTzs: 78000,
    rating: 5.0,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Moshi Farmers Cooperative Union',
      location: 'Moshi, Kilimanjaro',
      verified: true,
      trustScore: 100
    },
    inStock: true,
    smartDelivery: true,
    description: 'Hand-picked volcanic soil Arabica coffee grown at 1,800 meters on the slopes of Mount Kilimanjaro. Features bright acidity with notes of blackcurrant, dark chocolate, and citrus.',
    features: [
      '100% Organic & Fair Trade Certified by TBS',
      'Roasted in small artisanal batches in Moshi',
      'Degassing valve foil packaging ensures peak freshness',
      'Direct farm-to-cup traceability QR code included'
    ],
    securityVerified: true
  },
  {
    id: 'tz-laptop-1',
    name: 'Apple MacBook Air M3 (16GB RAM, 512GB SSD, 13.6" Liquid Retina)',
    swahiliName: 'Kompyuta Mpya ya Apple MacBook Air M3',
    category: 'Electronics & Gadgets',
    priceTzs: 3850000,
    originalPriceTzs: 4200000,
    rating: 4.9,
    reviewCount: 146,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'iStore East Africa',
      location: 'Slipway, Msasani, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Ultra-thin, blazing fast laptop powered by the Apple M3 chip with dedicated Secure Enclave for Touch ID fingerprint authentication and hardware-accelerated encryption.',
    features: [
      'Touch ID sensor for instant biometric authentication',
      'Up to 18 hours of battery life on a single charge',
      'MagSafe fast charging & Thunderbolt 4 ports',
      'Tanzania tax-paid & verified genuine import'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-1',
    name: 'Handcrafted Zanzibar Kitenge Silk & Wax Print Maxi Dress',
    swahiliName: 'Gauni la Kisasa la Kitenge cha Zanzibar',
    category: 'Fashion & Kitenge',
    priceTzs: 120000,
    originalPriceTzs: 150000,
    rating: 4.7,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: false,
    description: 'Authentic heavy-duty wax print cotton combined with breathable coastal silk accents. Designed by award-winning Zanzibar tailors with vibrant colorfast dyes.',
    features: [
      '100% high-grade Tanzanian cotton wax print',
      'Custom tailored fit available upon request',
      'Machine washable without color fading',
      'Supports local women artisan cooperatives in Unguja'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-1',
    name: 'Smart WiFi Inverter Refrigerator 420L (Multi-Air Flow, Stainless)',
    swahiliName: 'Friji Kubwa ya Kisasa Isiyotumia Umeme Mwingi',
    category: 'Home & Kitchen',
    priceTzs: 1650000,
    originalPriceTzs: 1890000,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Energy-saving inverter refrigerator designed specifically for tropical climates. Keeps food frozen for up to 24 hours during unexpected power cuts.',
    features: [
      'Digital inverter compressor with 10-year motor guarantee',
      'Surge tolerant operating voltage (160V - 260V)',
      'Frost-free multi-air cooling circulation',
      'Free home delivery within Dar es Salaam and Mwanza'
    ],
    securityVerified: true
  },
  {
    id: 'tz-spices-1',
    name: 'Zanzibar Organic Spice Box Set (Cloves, Cardamom, Nutmeg & Cinnamon)',
    swahiliName: 'Sanduku la Viungo Asilia kutoka Zanzibar',
    category: 'Agriculture & Coffee',
    priceTzs: 45000,
    originalPriceTzs: 55000,
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Zanzibar Spice Masters',
      location: 'Kizimbani Spice Farms, Zanzibar',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'A luxurious gift box featuring whole organic spices harvested directly from spice farms in Unguja. Sealed in airtight glass jars to preserve volatile aromatic oils.',
    features: [
      'Includes premium whole cloves, green cardamom, cinnamon bark, and nutmeg',
      'No preservatives or artificial coloring',
      'Accompanied by traditional Swahili recipe guide card',
      'Certified organic by Tanzania Bureau of Standards (TBS)'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-2',
    name: 'Portable Solar Power Station 500W / 518Wh Lithium Iron Phosphate',
    swahiliName: 'Benki Kubwa ya Umeme wa Jua ya Kubeba',
    category: 'Solar & Power Solutions',
    priceTzs: 890000,
    originalPriceTzs: 990000,
    rating: 4.8,
    reviewCount: 204,
    image: 'https://images.unsplash.com/photo-1558444479-8478461f4358?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kilimanjaro Green Energy Ltd',
      location: 'Arusha CBD',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Compact energy generator capable of powering laptops, LED lights, WiFi routers, and mini-coolers during safaris or home outages. Recharges via solar panels or AC wall socket.',
    features: [
      'LiFePO4 battery rated for 3000+ charge cycles',
      'Dual 220V AC outlets + USB-C 100W Power Delivery',
      'Integrated LED emergency flashlight & SOS beacon',
      'Weighs only 6.2 kg with sturdy carry handle'
    ],
    securityVerified: true
  }
];
