import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import Promo, { PromoType } from '../models/Promo';
import connectDB from '../config/database';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    basePrice: 199.99,
    variants: [
      {
        id: 'headphones-black',
        name: 'Black',
        price: 199.99,
        sku: 'WBH-BLACK-001',
        inventory: 50,
        attributes: { color: 'black' }
      },
      {
        id: 'headphones-white',
        name: 'White',
        price: 199.99,
        sku: 'WBH-WHITE-001',
        inventory: 30,
        attributes: { color: 'white' }
      },
      {
        id: 'headphones-blue',
        name: 'Blue',
        price: 219.99,
        sku: 'WBH-BLUE-001',
        inventory: 25,
        attributes: { color: 'blue' }
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    isActive: true
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, comfortable cotton t-shirt made from 100% organic cotton.',
    category: 'Clothing',
    basePrice: 29.99,
    variants: [
      {
        id: 'tshirt-red-s',
        name: 'Red - Small',
        price: 29.99,
        sku: 'PCT-RED-S',
        inventory: 100,
        attributes: { color: 'red', size: 'S' }
      },
      {
        id: 'tshirt-red-m',
        name: 'Red - Medium',
        price: 29.99,
        sku: 'PCT-RED-M',
        inventory: 150,
        attributes: { color: 'red', size: 'M' }
      },
      {
        id: 'tshirt-red-l',
        name: 'Red - Large',
        price: 29.99,
        sku: 'PCT-RED-L',
        inventory: 120,
        attributes: { color: 'red', size: 'L' }
      },
      {
        id: 'tshirt-blue-s',
        name: 'Blue - Small',
        price: 29.99,
        sku: 'PCT-BLUE-S',
        inventory: 80,
        attributes: { color: 'blue', size: 'S' }
      },
      {
        id: 'tshirt-blue-m',
        name: 'Blue - Medium',
        price: 29.99,
        sku: 'PCT-BLUE-M',
        inventory: 90,
        attributes: { color: 'blue', size: 'M' }
      },
      {
        id: 'tshirt-blue-l',
        name: 'Blue - Large',
        price: 29.99,
        sku: 'PCT-BLUE-L',
        inventory: 75,
        attributes: { color: 'blue', size: 'L' }
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ],
    isActive: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
    category: 'Electronics',
    basePrice: 299.99,
    variants: [
      {
        id: 'watch-black-42mm',
        name: 'Black - 42mm',
        price: 299.99,
        sku: 'SFW-BLACK-42',
        inventory: 40,
        attributes: { color: 'black', size: '42mm' }
      },
      {
        id: 'watch-silver-42mm',
        name: 'Silver - 42mm',
        price: 299.99,
        sku: 'SFW-SILVER-42',
        inventory: 35,
        attributes: { color: 'silver', size: '42mm' }
      },
      {
        id: 'watch-black-46mm',
        name: 'Black - 46mm',
        price: 329.99,
        sku: 'SFW-BLACK-46',
        inventory: 30,
        attributes: { color: 'black', size: '46mm' }
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500'
    ],
    isActive: true
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with RFID blocking technology and multiple card slots.',
    category: 'Accessories',
    basePrice: 79.99,
    variants: [
      {
        id: 'wallet-brown',
        name: 'Brown Leather',
        price: 79.99,
        sku: 'LW-BROWN-001',
        inventory: 60,
        attributes: { color: 'brown', material: 'leather' }
      },
      {
        id: 'wallet-black',
        name: 'Black Leather',
        price: 79.99,
        sku: 'LW-BLACK-001',
        inventory: 70,
        attributes: { color: 'black', material: 'leather' }
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
    ],
    isActive: true
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga.',
    category: 'Sports',
    basePrice: 49.99,
    variants: [
      {
        id: 'yoga-purple',
        name: 'Purple',
        price: 49.99,
        sku: 'YM-PURPLE-001',
        inventory: 45,
        attributes: { color: 'purple', thickness: '6mm' }
      },
      {
        id: 'yoga-green',
        name: 'Green',
        price: 49.99,
        sku: 'YM-GREEN-001',
        inventory: 55,
        attributes: { color: 'green', thickness: '6mm' }
      },
      {
        id: 'yoga-blue',
        name: 'Blue',
        price: 54.99,
        sku: 'YM-BLUE-001',
        inventory: 40,
        attributes: { color: 'blue', thickness: '8mm' }
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1506629905607-d9c297d3f5f9?w=500'
    ],
    isActive: true
  }
];

const samplePromos = [
  {
    code: 'WELCOME10',
    name: 'Welcome 10% Off',
    type: PromoType.PERCENTAGE,
    value: 10,
    minimumOrderAmount: 50,
    maxDiscountAmount: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    usageLimit: 1000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'SAVE25',
    name: 'Save $25 on Orders Over $100',
    type: PromoType.FIXED,
    value: 25,
    minimumOrderAmount: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    usageLimit: 500,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'ELECTRONICS15',
    name: '15% Off Electronics',
    type: PromoType.PERCENTAGE,
    value: 15,
    minimumOrderAmount: 75,
    maxDiscountAmount: 50,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    usageLimit: 200,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'FREESHIP',
    name: 'Free Shipping',
    type: PromoType.FIXED,
    value: 9.99,
    minimumOrderAmount: 50,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    usedCount: 0,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Promo.deleteMany({});

    // Seed products
    console.log('📦 Seeding products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Seed promos
    console.log('🎫 Seeding promo codes...');
    const createdPromos = await Promo.insertMany(samplePromos);
    console.log(`✅ Created ${createdPromos.length} promo codes`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Promo Codes: ${createdPromos.length}`);
    console.log('\n🔗 Available Promo Codes:');
    createdPromos.forEach(promo => {
      console.log(`   ${promo.code} - ${promo.name}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
