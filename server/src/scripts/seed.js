import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 149.99,
    compareAtPrice: 199.99,
    category: 'Electronics',
    brand: 'AudioTech',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        alt: 'Wireless Bluetooth Headphones'
      }
    ],
    inventory: 50,
    sku: 'WBH-001',
    tags: ['audio', 'wireless', 'bluetooth', 'headphones'],
    featured: true,
    rating: {
      average: 4.5,
      count: 128
    },
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Color': 'Black'
    },
    isActive: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50m.',
    price: 199.99,
    compareAtPrice: 249.99,
    category: 'Electronics',
    brand: 'FitPro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        alt: 'Smart Fitness Watch'
      }
    ],
    inventory: 75,
    sku: 'SFW-002',
    tags: ['fitness', 'smartwatch', 'health', 'sports'],
    featured: true,
    rating: {
      average: 4.7,
      count: 203
    },
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '7 days',
      'Water Resistance': '50m',
      'GPS': 'Built-in'
    },
    isActive: true
  },
  {
    name: 'Wireless Mechanical Keyboard',
    description: 'Premium mechanical keyboard with RGB backlighting, hot-swappable switches, and wireless connectivity. Perfect for gaming and typing.',
    price: 129.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        alt: 'Wireless Mechanical Keyboard'
      }
    ],
    inventory: 40,
    sku: 'WMK-003',
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
    featured: false,
    rating: {
      average: 4.6,
      count: 95
    },
    specifications: {
      'Switch Type': 'Cherry MX Red',
      'Connectivity': 'Wireless 2.4GHz + Bluetooth',
      'Battery': '30 days',
      'Layout': 'Full-size'
    },
    isActive: true
  },
  {
    name: 'Ultra HD 4K Webcam',
    description: 'Professional webcam with 4K resolution, auto-focus, dual microphones, and wide-angle lens. Ideal for streaming and video calls.',
    price: 89.99,
    compareAtPrice: 119.99,
    category: 'Electronics',
    brand: 'StreamPro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800',
        alt: 'Ultra HD 4K Webcam'
      }
    ],
    inventory: 60,
    sku: 'UHW-004',
    tags: ['webcam', '4k', 'streaming', 'video'],
    featured: true,
    rating: {
      average: 4.4,
      count: 142
    },
    specifications: {
      'Resolution': '4K 30fps',
      'FOV': '90 degrees',
      'Microphones': 'Dual stereo',
      'Mount': 'Universal clip'
    },
    isActive: true
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity power bank with fast charging, dual USB ports, and LED display. Charges phones 4-5 times on a single charge.',
    price: 39.99,
    category: 'Electronics',
    brand: 'PowerPlus',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
        alt: 'Portable Power Bank'
      }
    ],
    inventory: 100,
    sku: 'PPB-005',
    tags: ['power bank', 'battery', 'charging', 'portable'],
    featured: false,
    rating: {
      average: 4.3,
      count: 267
    },
    specifications: {
      'Capacity': '20000mAh',
      'Input': '18W USB-C',
      'Output': 'Dual USB 2.4A',
      'Weight': '350g'
    },
    isActive: true
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back. Perfect for long work sessions.',
    price: 299.99,
    compareAtPrice: 399.99,
    category: 'Home',
    brand: 'ComfortDesk',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
        alt: 'Ergonomic Office Chair'
      }
    ],
    inventory: 25,
    sku: 'EOC-006',
    tags: ['chair', 'office', 'furniture', 'ergonomic'],
    featured: false,
    rating: {
      average: 4.8,
      count: 89
    },
    specifications: {
      'Weight Capacity': '300 lbs',
      'Height Adjustment': 'Gas lift',
      'Material': 'Mesh + Steel',
      'Armrests': 'Adjustable 3D'
    },
    isActive: true
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Adjustable desk lamp with wireless charging pad, multiple color temperatures, and touch controls. USB port for device charging.',
    price: 49.99,
    category: 'Home',
    brand: 'BrightLife',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        alt: 'Smart LED Desk Lamp'
      }
    ],
    inventory: 80,
    sku: 'SLD-007',
    tags: ['lamp', 'led', 'desk', 'smart'],
    featured: false,
    rating: {
      average: 4.5,
      count: 156
    },
    specifications: {
      'Brightness': '5 levels',
      'Color Temp': '3000K-6000K',
      'Wireless Charging': '10W',
      'USB Port': '5V 2A'
    },
    isActive: true
  },
  {
    name: 'Noise-Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation, 24-hour battery life with case, and IPX5 water resistance.',
    price: 79.99,
    compareAtPrice: 99.99,
    category: 'Electronics',
    brand: 'AudioTech',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        alt: 'Noise-Cancelling Earbuds'
      }
    ],
    inventory: 90,
    sku: 'NCE-008',
    tags: ['earbuds', 'wireless', 'audio', 'anc'],
    featured: true,
    rating: {
      average: 4.6,
      count: 312
    },
    specifications: {
      'Battery Life': '6h + 18h case',
      'Bluetooth': '5.2',
      'Water Resistance': 'IPX5',
      'Driver': '10mm dynamic'
    },
    isActive: true
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Test Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing products and users...');
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    await User.insertMany(hashedUsers);
    console.log('✅ Created users');
    console.log('📧 Admin: admin@example.com / admin123');
    console.log('📧 Customer: customer@example.com / customer123');

    // Create products
    console.log('📦 Creating products...');
    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
