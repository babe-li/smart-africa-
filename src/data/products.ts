import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // --- Category 1: Electronics and Gadgets (10 items) ---
  {
    id: 'tz-phone-1',
    name: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)',
    swahiliName: 'Simu ya Kisasa ya Samsung S24 Ultra',
    category: 'Electronics and Gadgets',
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
      'Hardware Knox Vault Security and Biometric Sensor',
      'Dual SIM + eSIM (Supports Vodacom, Tigo, Airtel 5G)',
      '5000mAh Battery with 45W Fast Charging',
      'Verified by TCRA (Tanzania Communications Regulatory Authority)'
    ],
    securityVerified: true
  },
  {
    id: 'tz-laptop-1',
    name: 'Apple MacBook Air M3 (16GB RAM, 512GB SSD, 13.6" Liquid Retina)',
    swahiliName: 'Kompyuta Mpya ya Apple MacBook Air M3',
    category: 'Electronics and Gadgets',
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
      'MagSafe fast charging and Thunderbolt 4 ports',
      'Tanzania tax-paid and verified genuine import'
    ],
    securityVerified: true
  },
  {
    id: 'tz-phone-2',
    name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    swahiliName: 'Simu ya Apple iPhone 15 Pro Max',
    category: 'Electronics and Gadgets',
    priceTzs: 3200000,
    originalPriceTzs: 3500000,
    rating: 4.9,
    reviewCount: 228,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'iStore East Africa',
      location: 'Slipway, Msasani, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Stunning titanium design with the powerful A17 Pro chip, customizable Action button, and a pro camera system. Includes FaceID Secure Enclave cryptography.',
    features: [
      'Face ID biometric enclave for secure payments',
      'eSIM compatibility for local 5G network providers',
      'Super Retina XDR display with ProMotion',
      'Includes 1 year Apple official East Africa warranty'
    ],
    securityVerified: true
  },
  {
    id: 'tz-laptop-2',
    name: 'HP EliteBook 840 G10 (Intel Core i7, 16GB RAM, 512GB SSD)',
    swahiliName: 'Kompyuta ya Kazi ya HP EliteBook 840 G10',
    category: 'Electronics and Gadgets',
    priceTzs: 2350000,
    originalPriceTzs: 2600000,
    rating: 4.8,
    reviewCount: 82,
    image: 'https://images.unsplash.com/photo-1496181130204-7552cc145cdb?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Dar Tech Emporium (Official HP Partner)',
      location: 'Posta, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Enterprise-grade executive business laptop designed for security and productivity. Equipped with HP Wolf Pro Security, fingerprint reader, and physical camera shutter.',
    features: [
      'Built-in secure fingerprint scanner on keyboard deck',
      'HP Wolf Security Shield active security suite',
      'Lightweight aluminum chassis weighing just 1.36kg',
      'Equipped with genuine Windows 11 Pro license'
    ],
    securityVerified: true
  },
  {
    id: 'tz-audio-1',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    swahiliName: 'Hedifoni za Kisasa za Sony WH-1000XM5',
    category: 'Electronics and Gadgets',
    priceTzs: 950000,
    originalPriceTzs: 1100000,
    rating: 4.9,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kariakoo Sound Hub',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 95
    },
    inStock: true,
    smartDelivery: true,
    description: 'Industry-leading noise cancellation with eight microphones, exceptional sound quality with High-Resolution Audio support, and super clear hands-free calling.',
    features: [
      'Auto NC Optimizer adjusts parameters automatically',
      'Up to 30-hour battery life with 3-minute quick charge',
      'Ultra-comfortable, lightweight design with soft fit leather',
      'Intuitive touch controls for easy audio management'
    ],
    securityVerified: true
  },
  {
    id: 'tz-tablet-1',
    name: 'Apple iPad Air M2 (11-inch, 128GB, Wi-Fi, Space Gray)',
    swahiliName: 'Kishikwambi cha Apple iPad Air M2',
    category: 'Electronics and Gadgets',
    priceTzs: 1850000,
    originalPriceTzs: 2100000,
    rating: 4.8,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'iStore East Africa',
      location: 'Slipway, Msasani, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Versatile, powerful tablet powered by the M2 processor. Perfect for students, designers, and remote professionals. Works seamlessly with Apple Pencil and Magic Keyboard.',
    features: [
      'Liquid Retina display with anti-reflective coating',
      'M2 Chip with 8-core CPU and 10-core GPU',
      'Touch ID secure enclave built into the top button',
      'All-day battery life to power through your day'
    ],
    securityVerified: true
  },
  {
    id: 'tz-phone-3',
    name: 'Xiaomi Redmi Note 13 Pro+ 5G (512GB ROM, 12GB RAM)',
    swahiliName: 'Simu ya Xiaomi Redmi Note 13 Pro+',
    category: 'Electronics and Gadgets',
    priceTzs: 1150000,
    originalPriceTzs: 1300000,
    rating: 4.7,
    reviewCount: 118,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Dar Tech Emporium (Official Samsung Partner)',
      location: 'Posta, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Flagship-level smartphone featuring a 200MP camera with OIS, 1.5K curved AMOLED display, and 120W HyperCharge which charges to 100% in 19 minutes.',
    features: [
      'In-display fingerprint sensor for biometrics',
      'IP68 dust and water resistance rating',
      'MediaTek Dimensity 7200-Ultra high performance',
      'Dual stereo speakers with Dolby Atmos sound'
    ],
    securityVerified: true
  },
  {
    id: 'tz-gadget-1',
    name: 'Anker Prime 20000mAh Power Bank (200W Smart Digital Display)',
    swahiliName: 'Benki ya Nguvu ya Anker Prime 20,000mAh',
    category: 'Electronics and Gadgets',
    priceTzs: 320000,
    originalPriceTzs: 360000,
    rating: 4.9,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1609592424085-f538e55e3780?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kariakoo Sound Hub',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 95
    },
    inStock: true,
    smartDelivery: true,
    description: 'High-speed portable charger with active temperature monitoring and smart screen. Capable of charging two MacBooks simultaneously with up to 200W total output.',
    features: [
      'Smart Digital Display shows power status and speed',
      'Ultra-compact design that easily fits in your bag',
      'Universal compatibility with phones, tablets, and laptops',
      'Anker MultiProtect active temperature safety system'
    ],
    securityVerified: true
  },
  {
    id: 'tz-audio-2',
    name: 'JBL Charge 5 Waterproof Portable Bluetooth Speaker',
    swahiliName: 'Spika ya Kubebeka ya JBL Charge 5',
    category: 'Electronics and Gadgets',
    priceTzs: 480000,
    originalPriceTzs: 550000,
    rating: 4.8,
    reviewCount: 139,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kariakoo Sound Hub',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 95
    },
    inStock: true,
    smartDelivery: true,
    description: 'Bold JBL Original Pro Sound with long-excursion driver, separate tweeter, and dual pumping bass radiators. Up to 20 hours of playtime with a built-in powerbank.',
    features: [
      'IP67 waterproof and dustproof for beach or pool',
      'PartyBoost allows daisy-chaining multiple speakers',
      'Built-in powerbank to charge your devices on the go',
      'Durable rugged housing ideal for outdoor safaris'
    ],
    securityVerified: true
  },
  {
    id: 'tz-watch-1',
    name: 'Garmin Fenix 7X Sapphire Solar Multi-Sport Smartwatch',
    swahiliName: 'Saa ya Michezo ya Garmin Fenix 7X',
    category: 'Electronics and Gadgets',
    priceTzs: 1950000,
    originalPriceTzs: 2200000,
    rating: 4.9,
    reviewCount: 43,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Dar Tech Emporium (Official Samsung Partner)',
      location: 'Posta, Dar es Salaam',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Ultimate solar-powered multisport GPS watch with scratch-resistant Power Sapphire lens, built-in LED flashlight, and advanced training metrics for mountain hiking and running.',
    features: [
      'Solar charging lens extends battery up to 37 days',
      'Multi-band GNSS satnav navigation for precise tracking',
      'Built-in pulse oximeter and sleep score metrics',
      'Highly durable build conforming to military standards'
    ],
    securityVerified: true
  },

  // --- Category 2: Solar and Power Solutions (10 items) ---
  {
    id: 'tz-solar-1',
    name: 'SunPower Hybrid Solar Inverter System 3kVA + 200Ah Gel Battery',
    swahiliName: 'Mfumo Kamili wa Umeme wa Jua nyumbani',
    category: 'Solar and Power Solutions',
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
      'Surge protection and lightning arrestor integrated',
      '3-Year full manufacturer warranty in Tanzania'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-2',
    name: 'Portable Solar Power Station 500W / 518Wh Lithium Iron Phosphate',
    swahiliName: 'Benki Kubwa ya Umeme wa Jua ya Kubeba',
    category: 'Solar and Power Solutions',
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
      'Integrated LED emergency flashlight and SOS beacon',
      'Weighs only 6.2 kg with sturdy carry handle'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-3',
    name: 'Luminous 1.5kVA Eco Volt Inverter + 150Ah Tubular Battery',
    swahiliName: 'Inverter ya Luminous 1.5kVA na Betri ya Tubular',
    category: 'Solar and Power Solutions',
    priceTzs: 1150000,
    originalPriceTzs: 1300000,
    rating: 4.7,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kilimanjaro Green Energy Ltd',
      location: 'Arusha CBD',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Pure sine wave inverter with smart battery charging algorithms. Perfect for mid-sized homes to keep TVs, lights, and fans running during regular load-shedding cycles.',
    features: [
      'Tubular battery with high charge-retention rate',
      'Adaptive charging technology increases battery life',
      'Overload and short-circuit protection circuits',
      'Fully silent operation with automatic switchover'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-4',
    name: 'Jinko Solar Tiger Pro 450W Monocrystalline PV Solar Panel',
    swahiliName: 'Sola Paneli ya Jinko Solar 450W',
    category: 'Solar and Power Solutions',
    priceTzs: 380000,
    originalPriceTzs: 440000,
    rating: 4.9,
    reviewCount: 154,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mwanza Solar Hub',
      location: 'Nyamagana, Mwanza',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Highly efficient monocrystalline module with 9BB technology that decreases the distance between busbars to improve performance in high temperature Tanzanian climates.',
    features: [
      'Up to 20.7% module conversion efficiency',
      'Anti-PID (Potential Induced Degradation) assurance',
      'Strong wind and snow load resistance design',
      '25-Year performance warranty from manufacturer'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-5',
    name: 'SolarStreet All-in-One IP67 150W Solar Street Light',
    swahiliName: 'Taa ya Solar ya Barabarani / Nje 150W',
    category: 'Solar and Power Solutions',
    priceTzs: 240000,
    originalPriceTzs: 290000,
    rating: 4.8,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mwanza Solar Hub',
      location: 'Nyamagana, Mwanza',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'No electrical wiring required. Features a built-in highly sensitive radar motion sensor, durable aluminum housing, and high brightness LED chipsets.',
    features: [
      'Radar motion sensor dims to 30% when no motion',
      'High-grade IP67 waterproof rated metal housing',
      'Bright 15000 Lumens output for garden or driveway',
      'Includes premium bracket and remote controller'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-6',
    name: 'Victron Energy SmartSolar MPPT 100/50 Charge Controller',
    swahiliName: 'Kikagua Chaji cha Victron Energy MPPT',
    category: 'Solar and Power Solutions',
    priceTzs: 650000,
    originalPriceTzs: 720000,
    rating: 5.0,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kilimanjaro Green Energy Ltd',
      location: 'Arusha CBD',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Ultra-fast maximum power point tracking (MPPT) solar charge controller with built-in Bluetooth to configure, monitor, and update your off-grid system via smartphone app.',
    features: [
      'Up to 98% peak efficiency under high loads',
      'Bluetooth Smart built-in for wireless telemetry',
      'Battery Life intelligent management system',
      'Full protection against reverse polarity and overheating'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-7',
    name: 'Must Power 5kVA 48V Hybrid Solar Inverter (Built-in 80A MPPT)',
    swahiliName: 'Inverter kubwa ya Must Power 5kVA Hybrid',
    category: 'Solar and Power Solutions',
    priceTzs: 1950000,
    originalPriceTzs: 2200000,
    rating: 4.7,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1509391365360-bbbi007?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mwanza Solar Hub',
      location: 'Nyamagana, Mwanza',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Robust smart inverter for commercial setups or larger homes. Allows grid feed-in and battery prioritization. Configurable input voltage ranges via LCD setting.',
    features: [
      'Pure sine wave output with surge factor 2X',
      'Configurable AC/Solar charging priority via LCD',
      'Cold start function and smart battery charger',
      'Can operate with or without battery connected'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-8',
    name: 'Felicity Solar 10kWh 48V Wall-Mounted LiFePO4 Lithium Battery',
    swahiliName: 'Betri ya Lithium ya Felicity Solar 10kWh',
    category: 'Solar and Power Solutions',
    priceTzs: 6450000,
    originalPriceTzs: 7200000,
    rating: 4.9,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Kilimanjaro Green Energy Ltd',
      location: 'Arusha CBD',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'High capacity wall-mounted lithium energy storage unit. Utilizes advanced safe LiFePO4 chemistry with integrated Smart Battery Management System (BMS).',
    features: [
      '6000+ deep cycles at 80% Depth of Discharge',
      'Built-in display for precise state-of-charge tracking',
      'Supports parallel connection up to 12 modules',
      'Compatible with Victron, Growatt, and Must inverters'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-9',
    name: 'd.light S500 Solar LED Lantern and Mobile Charging Kit',
    swahiliName: 'Taa ya Solar d.light ya Kubebeka na Chaja ya Simu',
    category: 'Solar and Power Solutions',
    priceTzs: 95000,
    originalPriceTzs: 110000,
    rating: 4.8,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mwanza Solar Hub',
      location: 'Nyamagana, Mwanza',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Affordable, rugged solar lamp that delivers bright light and mobile phone charging. Ideal for rural setups, safaris, and night market vendors (Wamachinga).',
    features: [
      'Up to 100 hours of light on lowest setting',
      'Waterproof, drop-proof, extremely sturdy design',
      'Includes efficient solar panel with 5-meter wire',
      'Charges all standard USB mobile phone models'
    ],
    securityVerified: true
  },
  {
    id: 'tz-solar-10',
    name: 'Sundaya T-Lite Solar Home Kit (3-LED Bulbs + Charger Hub)',
    swahiliName: 'Mfumo Ndogo wa Sola Sundaya T-Lite (Taa 3)',
    category: 'Solar and Power Solutions',
    priceTzs: 320000,
    originalPriceTzs: 370000,
    rating: 4.8,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mwanza Solar Hub',
      location: 'Nyamagana, Mwanza',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Easy-to-install solar lighting package designed for small homes or retail kiosks. Bright LEDs with individual dimmer pull-switches and a central USB charging hub.',
    features: [
      '3 super-bright LED bulbs with modular bayonet plugs',
      'Plug-and-play setup without complex wiring',
      'Central control unit tracks battery voltage status',
      'Certified under lighting global quality standards'
    ],
    securityVerified: true
  },

  // --- Category 3: Agriculture and Coffee (10 items) ---
  {
    id: 'tz-coffee-1',
    name: 'Kilimanjaro Peaberry Arabica Coffee Beans (1kg Premium Roast)',
    swahiliName: 'Kahawa Halisi ya Kilimanjaro Peaberry',
    category: 'Agriculture and Coffee',
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
      '100% Organic and Fair Trade Certified by TBS',
      'Roasted in small artisanal batches in Moshi',
      'Degassing valve foil packaging ensures peak freshness',
      'Direct farm-to-cup traceability QR code included'
    ],
    securityVerified: true
  },
  {
    id: 'tz-spices-1',
    name: 'Zanzibar Organic Spice Box Set (Cloves, Cardamom, Nutmeg, Cinnamon)',
    swahiliName: 'Sanduku la Viungo Asilia kutoka Zanzibar',
    category: 'Agriculture and Coffee',
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
    id: 'tz-agri-1',
    name: 'Premium Mtibwa White Sugar (10kg Family Pack)',
    swahiliName: 'Sukari Nyeupe ya Mtibwa Kilo 10',
    category: 'Agriculture and Coffee',
    priceTzs: 45000,
    originalPriceTzs: 49000,
    rating: 4.8,
    reviewCount: 162,
    image: 'https://images.unsplash.com/photo-1581781890002-39fe5152865d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Morogoro Sugarcane Wholesale',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'High-grade domestic white cane sugar produced locally at the Mtibwa Sugar Estates in Morogoro, Tanzania. Perfectly refined, fine granulated sweetening agent.',
    features: [
      'Pure sugar cane extract with zero bleaching chemicals',
      'Moisture-proof sealed 10kg heavy-duty packaging',
      'Certified for human consumption by TBS and TFDA',
      'Direct contribution to local Tanzanian outgrower farmers'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-2',
    name: 'Mbeya Highland Super Rice (Grade A, 25kg Sacks)',
    swahiliName: 'Mchele Safi wa Mbeya Grade A - Kilo 25',
    category: 'Agriculture and Coffee',
    priceTzs: 85000,
    originalPriceTzs: 95000,
    rating: 4.9,
    reviewCount: 240,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mbeya Farmers Cooperatives',
      location: 'Mwanjelwa Market, Mbeya',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Famous aromatic Super Rice grown in the rich volcanic highland fields of Kyela, Mbeya. Extra long grains that swell and give off an incredible aroma when boiled.',
    features: [
      'Grade A, fully double-polished and sorted with zero stones',
      'Rich natural aroma with soft texture that stays fresh',
      'Packed in breathable high-density woven sacks',
      'TBS certified organic grain crop'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-3',
    name: 'Organic Tanzanian Pure Forest Honey (1 Liter Bottle)',
    swahiliName: 'Asali Halisi ya Nyuki wa Mwitu (Lita 1)',
    category: 'Agriculture and Coffee',
    priceTzs: 32000,
    originalPriceTzs: 38000,
    rating: 4.9,
    reviewCount: 184,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Tabora Beekeeping Union',
      location: 'Tabora Municipality',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: '100% natural, unpasteurized honey harvested from deep within the Miombo woodlands of Tabora. Rich in natural antioxidants, enzymes, and nutritional minerals.',
    features: [
      'Raw and unfiltered, preserved with active honey pollens',
      'No added sugar syrup, preservatives, or sweeteners',
      'Packaged in an easy-squeeze drip-proof plastic bottle',
      'Verified organic by the Ministry of Agriculture'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-4',
    name: 'Songea Premium Roasted Cashew Nuts (1kg Salted Pack)',
    swahiliName: 'Korosho za Kukaangwa za Songea (Kilo 1)',
    category: 'Agriculture and Coffee',
    priceTzs: 38000,
    originalPriceTzs: 44000,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Zanzibar Spice Masters',
      location: 'Kizimbani Spice Farms, Zanzibar',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Jumbo-sized cashew nuts grown in the southern region of Songea and expertly roasted to a rich golden finish with just a touch of sea salt.',
    features: [
      'Packed in airtight resealable zip-lock foil pouch',
      'Gluten-free, high fiber, and rich in heart-healthy fats',
      'Excellent snack profile with crunchy texture and consistency',
      'Meets strict export-grade guidelines certified by TBS'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-5',
    name: 'Arusha Organic Chia Seeds (1kg Nutrition Pack)',
    swahiliName: 'Mbegu za Chia Asilia za Arusha (Kilo 1)',
    category: 'Agriculture and Coffee',
    priceTzs: 25000,
    originalPriceTzs: 30000,
    rating: 4.7,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1511119266191-4e782635bc58?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Moshi Farmers Cooperative Union',
      location: 'Moshi, Kilimanjaro',
      verified: true,
      trustScore: 100
    },
    inStock: true,
    smartDelivery: true,
    description: 'Superfood chia seeds grown in the fertile valleys surrounding Mount Meru. Packed with Omega-3 fatty acids, plant-based proteins, and essential dietary fibers.',
    features: [
      '100% raw, pesticide-free, and sun-dried organic seeds',
      'Perfect addition to morning porridge, smoothies, or baking',
      'Supports healthy digestion and provides long-lasting energy',
      'Packaged in eco-friendly biodegradable paper bags'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-6',
    name: 'Pemba Island Organic Vanilla Beans (10 Gourmet Pods)',
    swahiliName: 'Kekee za Vanilla Asilia kutoka Pemba',
    category: 'Agriculture and Coffee',
    priceTzs: 110000,
    originalPriceTzs: 130000,
    rating: 4.9,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1609106241038-0428989e2402?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Zanzibar Spice Masters',
      location: 'Kizimbani Spice Farms, Zanzibar',
      verified: true,
      trustScore: 99
    },
    inStock: true,
    smartDelivery: true,
    description: 'Plump, highly aromatic vanilla pods cultivated organically on Pemba Island. Boasts rich, oily skins with thousands of sweet seeds per pod, giving authentic bourbon-like tones.',
    features: [
      'Grade A premium gourmet pods (16-18cm long)',
      'Moist and flexible structure ensuring optimal freshness',
      'Perfect for fine baking, custards, and vanilla extracts',
      'Packed in food-grade glass tubes with airtight screw-caps'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-7',
    name: 'Iringa Dried Premium Oyster Mushrooms (500g Pack)',
    swahiliName: 'Uyoga Kavu wa Oyster wa Iringa (Gramu 500)',
    category: 'Agriculture and Coffee',
    priceTzs: 42000,
    originalPriceTzs: 48000,
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Moshi Farmers Cooperative Union',
      location: 'Moshi, Kilimanjaro',
      verified: true,
      trustScore: 100
    },
    inStock: true,
    smartDelivery: true,
    description: 'High quality oyster mushrooms grown in climate-controlled environments in Iringa. Slowly dehydrated to preserve texture, nutrients, and earthy savory flavors.',
    features: [
      'No chemical additives or artificial grow agents used',
      'Long shelf life (up to 12 months) in dry storage',
      'Easily reconstituted in hot water for stews or soups',
      'Packed under sanitary conditions certified by TBS'
    ],
    securityVerified: true
  },
  {
    id: 'tz-agri-8',
    name: 'Mbeya Highland Pure Green Tea (500g Loose Leaf)',
    swahiliName: 'Majani ya Chai ya Kijani ya Mbeya (Gramu 500)',
    category: 'Agriculture and Coffee',
    priceTzs: 18000,
    originalPriceTzs: 22000,
    rating: 4.8,
    reviewCount: 57,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Mbeya Farmers Cooperatives',
      location: 'Mwanjelwa Market, Mbeya',
      verified: true,
      trustScore: 98
    },
    inStock: true,
    smartDelivery: true,
    description: 'Premium whole loose-leaf green tea harvested from high-elevation estates in Mbeya. Light, refreshing, and loaded with natural catechins and antioxidants.',
    features: [
      'Single-origin high altitude tea leaves',
      'Mild flavor with a slightly sweet vegetal finish',
      'Double sealed in foil lining to maintain antioxidants',
      '100% natural, pesticide-free tea crop'
    ],
    securityVerified: true
  },

  // --- Category 4: Fashion and Kitenge (10 items) ---
  {
    id: 'tz-fashion-1',
    name: 'Handcrafted Zanzibar Kitenge Silk and Wax Print Maxi Dress',
    swahiliName: 'Gauni la Kisasa la Kitenge cha Zanzibar',
    category: 'Fashion and Kitenge',
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
    id: 'tz-fashion-2',
    name: 'Morogoro Premium Leather Handmade Safari Boots',
    swahiliName: 'Viatu vya Ngozi Halisi vya Morogoro',
    category: 'Fashion and Kitenge',
    priceTzs: 135000,
    originalPriceTzs: 160000,
    rating: 4.9,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Durable, stylish safari boots handcrafted in Morogoro from 100% genuine full-grain cowhide leather. Reinforced stitching and flexible rubber soles designed to withstand rough terrain.',
    features: [
      'Water-resistant treated premium leather upper',
      'Hand-stitched detailing by skilled local cobblers',
      'Anti-slip high grip rubber outsole',
      'Includes breathable memory foam inner padding'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-3',
    name: 'Handcrafted Maasai Beaded Collar Necklace and Earrings Set',
    swahiliName: 'Seti ya Shanga za Kimaasai na Vipuli',
    category: 'Fashion and Kitenge',
    priceTzs: 65000,
    originalPriceTzs: 80000,
    rating: 4.8,
    reviewCount: 73,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Stunning ceremonial neckwear handcrafted by Maasai women in Arusha. Features intricate geometric patterns using colorful glass beads on a durable leather base.',
    features: [
      'Traditionally beaded using highly durable glass seed beads',
      'Adjustable leather back-lacing fits all neck sizes',
      'Includes matching drop dangle earrings',
      'Directly supports Arusha Maasai women weavers'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-4',
    name: 'Premium Wax Print Cotton Ankara Suit Jacket',
    swahiliName: 'Koti la Kisasa la Ankara Kitenge',
    category: 'Fashion and Kitenge',
    priceTzs: 180000,
    originalPriceTzs: 220000,
    rating: 4.8,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: false,
    description: 'An elegant structured blazer featuring rich vibrant Kitenge patterns. Tailored with premium satin inner lining, notched lapels, and two-button closure.',
    features: [
      'Heavy duty 100% cotton Ankara wax print exterior',
      'Sleek inner satin lining for high-wear comfort',
      'Modern slim fit structure with double vent styling',
      'Handmade by master tailors in Kinondoni, Dar'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-5',
    name: 'Zanzibar Straw Beach Sun Hat with Kitenge Band Accent',
    swahiliName: 'Kofia ya Pwani ya Zanzibar yenye Kitenge',
    category: 'Fashion and Kitenge',
    priceTzs: 35000,
    originalPriceTzs: 45000,
    rating: 4.6,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Hand-woven wide-brim beach hat crafted from organic palm fibers. Decorated with a stylish, colorful detachable Kitenge fabric band accent.',
    features: [
      'Woven from 100% natural biodegradable palm leaves',
      'Wide floppy brim offers great UV sun protection',
      'Detachable band can be styled separately as a scarf',
      'Crafted by coastal women artisans in Jambiani'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-6',
    name: 'Authentic Maasai Red Grid Shuka Throw Blanket',
    swahiliName: 'Shuka Halisi ya Kimaasai (Blanketi)',
    category: 'Fashion and Kitenge',
    priceTzs: 28000,
    originalPriceTzs: 35000,
    rating: 5.0,
    reviewCount: 320,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'The iconic Red Grid Shuka cloth of the Maasai warriors. Highly versatile, acts as a warm blanket, throw, tablecloth, or wrap for safaris and camping.',
    features: [
      'Made of warm, quick-drying high grade acrylic fiber',
      'Large dimensions: 150cm x 200cm coverage',
      'Does not fade or shrink under regular warm washing',
      'Woven in Arusha under ethical labor standards'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-7',
    name: 'Traditional Hand-printed Zanzibar Kanga Wrap (Leso Pair)',
    swahiliName: 'Kanga Jozi Mbili za Kisasa (Leso yenye Ujumbe)',
    category: 'Fashion and Kitenge',
    priceTzs: 32000,
    originalPriceTzs: 38000,
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Premium matching pair of Kanga cotton wraps. Features beautiful floral border designs surrounding a traditional Swahili proverb (ujumbe) of wisdom.',
    features: [
      'Comes as a matched pair of two unsewn panels',
      'Soft breathable 100% cotton fabric weave',
      'Features unique motivational and poetic Swahili writing',
      'Vibrant long-lasting colors ideal for daily wear'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-8',
    name: 'Tanzanian Leather Crossbody Bag with Ankara Print Lining',
    swahiliName: 'Mkoba wa Ngozi wenye Mapambo ya Ankara',
    category: 'Fashion and Kitenge',
    priceTzs: 125000,
    originalPriceTzs: 145000,
    rating: 4.7,
    reviewCount: 51,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Compact daily bag made of oil-tanned dark leather. Opens up to reveal a beautiful, colorful African wax print Ankara fabric internal lining with smart zip pockets.',
    features: [
      'Real full-grain cowhide leather structure',
      'Adjustable leather shoulder sling with metal buckle',
      'Magnetic flap closure with heavy duty brass hardware',
      'Designed and hand-stitched in Mikocheni, Dar'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-9',
    name: 'Custom Kitenge Slim-Fit Casual Men Button-Up Shirt',
    swahiliName: 'Shati la Mikono Mifupi la Kitenge la Kiume',
    category: 'Fashion and Kitenge',
    priceTzs: 55000,
    originalPriceTzs: 65000,
    rating: 4.8,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Modern men’s short-sleeve button-down shirt constructed using breathable Tanzanian-milled wax print cotton. Perfect for casual events or tropical beach outings.',
    features: [
      'Tailored modern slim fit with button-down collar',
      'Handcrafted using premium single-source cotton fabrics',
      'Vibrant pattern alignment matches perfectly across seams',
      'Pre-shrunk fabric ensuring a reliable fit after washing'
    ],
    securityVerified: true
  },
  {
    id: 'tz-fashion-10',
    name: 'Handcrafted Hammered Brass Safari Wildlife Cuff Bracelet',
    swahiliName: 'Kikuku cha Shaba cha Sanaa ya Wanyama',
    category: 'Fashion and Kitenge',
    priceTzs: 45000,
    originalPriceTzs: 55000,
    rating: 4.9,
    reviewCount: 34,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Stone Town Artisans Guild',
      location: 'Stone Town, Zanzibar',
      verified: true,
      trustScore: 96
    },
    inStock: true,
    smartDelivery: true,
    description: 'Gorgeous thick solid brass cuff bracelet. Features beautiful hand-etched safari wildlife motifs (elephants, giraffes) and hammered rustic edge finishes.',
    features: [
      '100% recycled industrial brass sourced in Dar es Salaam',
      'Slightly malleable metal allows adjusting to fit any wrist',
      'High-polished finish treated to resist tarnishing',
      'Individually forged and hammered by hand'
    ],
    securityVerified: true
  },

  // --- Category 5: Home and Kitchen (10 items) ---
  {
    id: 'tz-home-1',
    name: 'Smart WiFi Inverter Refrigerator 420L (Multi-Air Flow, Stainless)',
    swahiliName: 'Friji Kubwa ya Kisasa Isiyotumia Umeme Mwingi',
    category: 'Home and Kitchen',
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
    id: 'tz-home-2',
    name: 'Hand-carved Zanzibar Teak Wood Coffee Table',
    swahiliName: 'Meza ya Kahawa ya Mbao ya Zanzibar Teak',
    category: 'Home and Kitchen',
    priceTzs: 850000,
    originalPriceTzs: 980000,
    rating: 5.0,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: false,
    description: 'Stunning centerpiece coffee table meticulously hand-carved from seasoned Zanzibar teak wood. Features traditional Swahili geometric lattice patterns (Mashrabiya) and thick legs.',
    features: [
      'Made of 100% sustainable premium teak heartwood',
      'Natural oil finish protects wood fibers from moisture',
      'Includes brass reinforcement accents at joints',
      'No assembly required, delivered fully formed'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-3',
    name: 'Traditional Clay Pot Cookware Set (Set of 3, Small to Large)',
    swahiliName: 'Vyungu vya Udongo vya Kupikia (Seti ya 3)',
    category: 'Home and Kitchen',
    priceTzs: 75000,
    originalPriceTzs: 90000,
    rating: 4.8,
    reviewCount: 132,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Traditional Tanzanian clay cooking pots crafted by hand. Enhances the flavor of local fish stews, beans, and beef by slowly distributing heat during cooking.',
    features: [
      'Made of organic, chemical-free red clay mud',
      'Perfect for open fire wood, charcoal, or gas stoves',
      'Includes fitted clay lids with easy-grip handles',
      'Hand-fired in local kilns in Coast Region'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-4',
    name: 'Royal Crown Heavy-Duty Stainless Steel Cookware Set (12-Piece)',
    swahiliName: 'Vyombo vya Kupikia vya Chuma vya Royal Crown (Seti ya 12)',
    category: 'Home and Kitchen',
    priceTzs: 350000,
    originalPriceTzs: 400000,
    rating: 4.8,
    reviewCount: 115,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'High-quality 12-piece professional cookware set. Features heavy-duty tri-ply encapsulated bases for uniform heat distribution and stay-cool riveted handles.',
    features: [
      'Constructed with surgical grade 18/10 stainless steel',
      'Includes heat-resistant tempered glass lids',
      'Safe for gas, electric, and induction stovetops',
      'Dishwasher safe and extremely easy to clean'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-5',
    name: 'Sharp 5-Burner Gas & Electric Combo Cooker (Oven, 75cm)',
    swahiliName: 'Jiko Kubwa la Sharp la Gas na Umeme (Milango 5)',
    category: 'Home and Kitchen',
    priceTzs: 1450000,
    originalPriceTzs: 1650000,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'All-in-one free-standing cooker with 4 gas burners and 1 rapid electric plate. Equipped with a large multi-function fan oven and integrated rotisserie function.',
    features: [
      'Double glass insulated oven door protects kids',
      'Equipped with safety flame failure cutoff valves',
      'Includes baking tray, wire grid, and grill spit',
      'Robust cast iron pan supports prevent wobbles'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-6',
    name: 'Hand-woven Sisal Storage Basket Set (3-Piece, Iringa Weaves)',
    swahiliName: 'Vikapu vya Kusuka vya Iringa Sisal (Seti ya 3)',
    category: 'Home and Kitchen',
    priceTzs: 65000,
    originalPriceTzs: 75000,
    rating: 4.9,
    reviewCount: 148,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Set of three nesting storage baskets hand-woven in Iringa using organic sisal fibers dyed with local plants. Perfect for organizing toys, laundry, or dry kitchen supplies.',
    features: [
      'Woven from strong, sustainable local sisal fibers',
      'Features traditional neutral earth-tone designs',
      'Extremely durable leather carry handles on sides',
      'Nesting capability for compact storage when empty'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-7',
    name: 'LG Smart Inverter Microwave Oven 25L (NeoChef, Matte Charcoal)',
    swahiliName: 'Mikrowevu ya LG Smart Inverter 25L',
    category: 'Home and Kitchen',
    priceTzs: 420000,
    originalPriceTzs: 480000,
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'NeoChef series microwave with precise smart inverter heating control. Defrosts, warms, and cooks delicious meals quickly while retaining natural moisture and nutrients.',
    features: [
      'LG Smart Inverter technology reduces energy loss',
      'Anti-Bacterial EasyClean interior coating resists odors',
      'Highly stable hexagonal glass turntable ring design',
      'Sleek touch controller panel with LED timer'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-8',
    name: 'Hand-carved Zanzibar Coconut Husk Welcome Doormat (Set of 2)',
    swahiliName: 'Zulia la Pwani la Karibu kutoka Nazi (Seti ya 2)',
    category: 'Home and Kitchen',
    priceTzs: 40000,
    originalPriceTzs: 50000,
    rating: 4.7,
    reviewCount: 61,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Heavy duty outdoor welcome doormat set made from natural coir coconut fibers harvested on Zanzibar island. Traps mud and dirt effectively.',
    features: [
      'Thick stiff coir bristles grab mud from boots easily',
      'Non-slip rubber backing prevents mat movement',
      'Naturally water-resistant and mold-resistant coir',
      'Features beautiful hand-stenciled "Karibu" greeting'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-9',
    name: 'Philips Daily Collection Juicer Extractor (800W, Black)',
    swahiliName: 'Chombo cha Philips cha Kutengeneza Juisi (Wati 800)',
    category: 'Home and Kitchen',
    priceTzs: 280000,
    originalPriceTzs: 320000,
    rating: 4.8,
    reviewCount: 104,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'High performance centrifugal juice extractor. Extract up to 2 liters of fresh healthy juice in one go without emptying the large pulp container.',
    features: [
      'QuickClean technology lets you clean within 1 minute',
      'Extra-large feeding tube fits whole apples easily',
      'All pulp collected in one transparent vessel',
      'Powerful 800W motor easily blends hard carrots'
    ],
    securityVerified: true
  },
  {
    id: 'tz-home-10',
    name: 'Premium Bamboo Fibre Reusable Eco Dinnerware Set (24-Piece)',
    swahiliName: 'Seti ya Sahani Asilia za Bamboo (Vipande 24)',
    category: 'Home and Kitchen',
    priceTzs: 120000,
    originalPriceTzs: 150000,
    rating: 4.9,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    seller: {
      name: 'Homepoint Appliances Ltd',
      location: 'Kariakoo, Dar es Salaam',
      verified: true,
      trustScore: 97
    },
    inStock: true,
    smartDelivery: true,
    description: 'Elegant dinnerware set made from 100% biodegradable organic bamboo fibers. Includes plates, bowls, and drinking cups styled with tasteful pastel hues.',
    features: [
      'BPA-free, non-toxic, and certified food safe',
      'Shatter-proof lightweight design perfect for picnics',
      'Fully biodegradable, eco-friendly green product',
      'Dishwasher safe (top rack recommended)'
    ],
    securityVerified: true
  }
];
