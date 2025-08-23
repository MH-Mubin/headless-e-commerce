# E-commerce Backend API

A headless e-commerce backend built with TypeScript, Express.js, and MongoDB. Features product catalog management, guest cart functionality, promotional codes, and order processing.

## Features

- **Product Catalog**: Products with variants, pricing, and inventory management
- **Guest Cart**: Token-based cart system for guest users
- **Promotional Codes**: Percentage and fixed discount support with validation
- **Order Management**: Complete checkout and order tracking system
- **Input Validation**: Comprehensive validation using Zod
- **API Documentation**: OpenAPI/Swagger documentation
- **MongoDB Aggregation**: Efficient database queries using aggregation pipelines
- **Request Logging**: Structured logging for monitoring
- **Error Handling**: Consistent error responses and validation

## Tech Stack

- **Runtime**: Node.js LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with MongoDB Memory Server
- **Logging**: Morgan

## Prerequisites

- Node.js 18+ LTS
- MongoDB 5.0+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # Using MongoDB service (Linux/Mac)
   sudo systemctl start mongod
   
   # Using MongoDB Community Edition (Windows)
   net start MongoDB
   
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot reloading.

### Production Mode
```bash
npm run build
npm start
```

### Database Seeding
Populate the database with sample data:
```bash
npm run seed
```

This will create:
- 5 sample products with variants
- 4 promotional codes (WELCOME10, SAVE25, ELECTRONICS15, FREESHIP)

## API Endpoints

### Base URL
- Development: `http://localhost:3000`
- API Documentation: `http://localhost:3000/api-docs`

### Products
- `GET /api/products` - Get all products (with filtering and pagination)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)

### Cart Management
- `POST /api/cart` - Create new cart (returns guest token)
- `GET /api/cart/:guestToken` - Get cart by guest token
- `POST /api/cart/:guestToken/items` - Add item to cart
- `PUT /api/cart/:guestToken/items/:productId/:variantId` - Update cart item
- `DELETE /api/cart/:guestToken/items/:productId/:variantId` - Remove cart item
- `DELETE /api/cart/:guestToken/clear` - Clear cart

### Promotional Codes
- `GET /api/promos` - Get all active promos
- `POST /api/promos` - Create new promo
- `POST /api/promos/:guestToken/validate` - Validate promo for cart
- `POST /api/promos/:guestToken/apply` - Apply promo to cart
- `DELETE /api/promos/:guestToken/remove` - Remove applied promo

### Orders
- `POST /api/orders/:guestToken` - Create order from cart
- `GET /api/orders/:orderNumber` - Get order by order number
- `GET /api/orders/guest/:guestToken` - Get orders by guest token
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:orderNumber/status` - Update order status

## API Usage Examples

### 1. Create a Cart
```bash
curl -X POST http://localhost:3000/api/cart
```

Response:
```json
{
  "success": true,
  "data": {
    "guestToken": "550e8400-e29b-41d4-a716-446655440000",
    "cart": {
      "_id": "...",
      "guestToken": "550e8400-e29b-41d4-a716-446655440000",
      "items": [],
      "totalAmount": 0
    }
  }
}
```

### 2. Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart/{guestToken}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "64a1b2c3d4e5f6789abcdef0",
    "variantId": "headphones-black",
    "quantity": 1
  }'
```

### 3. Apply Promo Code
```bash
curl -X POST http://localhost:3000/api/promos/{guestToken}/apply \
  -H "Content-Type: application/json" \
  -d '{
    "promoCode": "WELCOME10"
  }'
```

### 4. Create Order
```bash
curl -X POST http://localhost:3000/api/orders/{guestToken} \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── config/
│   ├── database.ts          # MongoDB connection
│   └── swagger.ts           # API documentation config
├── controllers/
│   ├── productController.ts # Product CRUD operations
│   ├── cartController.ts    # Cart management
│   ├── promoController.ts   # Promotional codes
│   └── orderController.ts   # Order processing
├── middleware/
│   ├── errorHandler.ts      # Error handling middleware
│   └── logger.ts           # Request logging
├── models/
│   ├── Product.ts          # Product schema
│   ├── Cart.ts             # Cart schema
│   ├── Promo.ts            # Promo schema
│   └── Order.ts            # Order schema
├── routes/
│   ├── productRoutes.ts    # Product endpoints
│   ├── cartRoutes.ts       # Cart endpoints
│   ├── promoRoutes.ts      # Promo endpoints
│   └── orderRoutes.ts      # Order endpoints
├── scripts/
│   └── seed.ts             # Database seeder
├── utils/
│   ├── validation.ts       # Zod validation schemas
│   └── helpers.ts          # Utility functions
├── __tests__/
│   ├── setup.ts            # Test configuration
│   └── product.test.ts     # Product API tests
└── index.ts                # Application entry point
```

## Data Models

### Product
- Name, description, category, base price
- Multiple variants with individual pricing and inventory
- Image URLs and active status
- Full-text search support

### Cart
- Guest token-based identification
- Items with product/variant references
- Automatic total calculation
- 7-day expiration

### Promotional Codes
- Percentage or fixed amount discounts
- Validity date ranges
- Usage limits and minimum order amounts
- Maximum discount caps for percentage promos

### Orders
- Complete order information with items
- Shipping address capture
- Status tracking (pending → confirmed → processing → shipped → delivered)
- Promo code application and discount calculation

## MongoDB Aggregation Examples

The API uses MongoDB aggregation pipelines for efficient queries:

### Product Filtering with Aggregation
```javascript
const pipeline = [
  { $match: { isActive: true, category: "Electronics" } },
  { $match: { basePrice: { $gte: 50, $lte: 500 } } },
  { $skip: 0 },
  { $limit: 10 }
];
```

### Category Aggregation
```javascript
const categories = await Product.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Deployment

### Using Docker
```bash
# Build image
docker build -t ecommerce-backend .

# Run container
docker run -p 3000:3000 -e MONGODB_URI=mongodb://host:27017/ecommerce ecommerce-backend
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the test files for usage examples
