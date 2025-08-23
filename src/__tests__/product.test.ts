import request from 'supertest';
import app from '../index';
import Product from '../models/Product';

describe('Product API', () => {
  const sampleProduct = {
    name: 'Test Product',
    description: 'A test product description',
    category: 'Electronics',
    basePrice: 99.99,
    variants: [
      {
        id: 'variant-1',
        name: 'Red - Medium',
        price: 99.99,
        sku: 'TEST-RED-M',
        inventory: 10,
        attributes: { color: 'red', size: 'M' }
      }
    ],
    images: ['https://example.com/image1.jpg'],
    isActive: true
  };

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(sampleProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sampleProduct.name);
      expect(response.body.data.variants).toHaveLength(1);
    });

    it('should return validation error for invalid product', async () => {
      const invalidProduct = { ...sampleProduct };
      delete (invalidProduct as any).name;

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create(sampleProduct);
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create(sampleProduct);
      productId = product._id.toString();
    });

    it('should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sampleProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
