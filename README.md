# Headless E-commerce Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

A production-ready, scalable headless e-commerce backend built with modern technologies. This API provides comprehensive e-commerce functionality including product catalog management, guest cart operations, promotional code system, and complete order processing workflow.

## Key Features

### Core E-commerce Functionality
- Product Catalog: Multi-variant products with dynamic pricing and inventory tracking
- Guest Cart System: Token-based cart management with automatic expiration
- Promotional Engine: Flexible discount system with percentage/fixed amounts and advanced validation
- Order Management: Complete checkout workflow with status tracking and inventory updates
- Guest User Support: Full e-commerce experience without user registration

### Technical Excellence
- Type Safety: Full TypeScript implementation with strict type checking
- Input Validation: Comprehensive Zod schema validation with detailed error messages
- API Documentation: Interactive Swagger/OpenAPI documentation
- MongoDB Aggregation: Optimized database queries using aggregation pipelines
- Request Logging: Structured logging with Morgan for monitoring and debugging
- Testing Suite: Jest tests with MongoDB Memory Server for reliable testing
- Security: Helmet.js security headers and CORS configuration

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   Express API   │───▶│   MongoDB       │
│  (Frontend/     │    │                 │    │                 │
│   Mobile)       │    │  • Controllers  │    │  • Products     │
└─────────────────┘    │  • Middleware   │    │  • Carts        │
                       │  • Validation   │    │  • Orders       │
                       │  • Routes       │    │  • Promos       │
                       └─────────────────┘    └─────────────────┘
```

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime  | Node.js    | 18+ LTS | JavaScript runtime environment |
| Framework| Express.js | ^4.18.2 | Web application framework |
| Language | TypeScript | ^5.1.6  | Type-safe JavaScript development |
| Database | MongoDB    | 5.0+    | NoSQL document database |
| ODM      | Mongoose   | ^7.5.0  | MongoDB object modeling |
| Validation| Zod        | ^3.22.2 | Schema validation library |
| Documentation| Swagger/OpenAPI| ^5.0.0 | API documentation |
| Testing   | Jest       | ^29.6.2 | JavaScript testing framework |
| Security  | Helmet.js  | ^7.0.0  | Security middleware |
| Logging   | Morgan     | ^1.10.0 | HTTP request logger |

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: Version 18.0 or higher ([Download](https://nodejs.org/))
- MongoDB: Version 5.0 or higher ([Installation Guide](https://docs.mongodb.com/manual/installation/))
- npm: Comes with Node.js (or yarn as alternative)
- Git: For version control ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/MH-Mubin/headless-e-commerce.git
cd headless-e-commerce

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### 2. Environment Configuration
Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

### 3. Database Setup
```bash
# Start MongoDB (if running locally)
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB

# Docker alternative
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Seed the database with sample data
npm run seed
```

### 4. Start Development Server
```bash
# Development mode with hot reloading
npm run dev

# The server will start on http://localhost:3000
# API Documentation: http://localhost:3000/api-docs
```

## API Documentation

### Interactive Documentation
- Swagger UI: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

### Core Endpoints

#### Cart Management
```http
POST   /api/cart                                    # Create new cart
GET    /api/cart/:guestToken                        # Get cart by token
POST   /api/cart/:guestToken/items                  # Add item to cart
PUT    /api/cart/:guestToken/items/:productId/:variantId  # Update cart item
DELETE /api/cart/:guestToken/items/:productId/:variantId  # Remove cart item
DELETE /api/cart/:guestToken/clear                  # Clear entire cart
```

#### Product Catalog
```http
GET    /api/products                                 # List products (with filters)
GET    /api/products/:id                            # Get product details
GET    /api/products/categories                     # Get all categories
POST   /api/products                                # Create product (admin)
PUT    /api/products/:id                            # Update product (admin)
DELETE /api/products/:id                            # Delete product (admin)
```

#### Promotional Codes
```http
GET    /api/promos                                  # List active promos
POST   /api/promos                                  # Create promo (admin)
POST   /api/promos/:guestToken/validate             # Validate promo code
POST   /api/promos/:guestToken/apply                # Apply promo to cart
DELETE /api/promos/:guestToken/remove               # Remove applied promo
```

#### Order Management
```http
POST   /api/orders/:guestToken                      # Create order from cart
GET    /api/orders/:orderNumber                     # Get order details
GET    /api/orders/guest/:guestToken                # Get orders by guest token
GET    /api/orders                                  # List all orders (admin)
PUT    /api/orders/:orderNumber/status              # Update order status (admin)
```

### Request/Response Examples

#### Create Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "guestToken": "550e8400-e29b-41d4-a716-446655440000",
    "cart": {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "guestToken": "550e8400-e29b-41d4-a716-446655440000",
      "items": [],
      "totalAmount": 0,
      "createdAt": "2023-07-01T12:00:00.000Z",
      "expiresAt": "2023-07-08T12:00:00.000Z"
    }
  }
}
```

#### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart/{guestToken}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "64a1b2c3d4e5f6789abcdef1",
    "variantId": "wireless-headphones-black",
    "quantity": 2
  }'
```

#### Apply Promotional Code
```bash
curl -X POST http://localhost:3000/api/promos/{guestToken}/apply \
  -H "Content-Type: application/json" \
  -d '{
    "promoCode": "WELCOME10"
  }'
```

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- product.test.ts
```

### Test Structure
```
src/__tests__/
├── setup.ts              # Test configuration
├── product.test.ts        # Product API tests
├── cart.test.ts          # Cart functionality tests
├── promo.test.ts         # Promotional code tests
└── order.test.ts         # Order management tests
```

## Project Structure

```
src/
├── config/
│   ├── database.ts        # MongoDB connection configuration
│   └── swagger.ts         # API documentation setup
├── controllers/
│   ├── productController.ts   # Product CRUD operations
│   ├── cartController.ts      # Cart management logic
│   ├── promoController.ts     # Promotional code handling
│   └── orderController.ts     # Order processing workflow
├── middleware/
│   ├── errorHandler.ts    # Global error handling
│   ├── logger.ts          # Request logging middleware
│   └── validation.ts      # Input validation middleware
├── models/
│   ├── Product.ts         # Product schema with variants
│   ├── Cart.ts            # Cart schema with TTL
│   ├── Promo.ts           # Promotional code schema
│   └── Order.ts           # Order schema with status tracking
├── routes/
│   ├── productRoutes.ts   # Product endpoint definitions
│   ├── cartRoutes.ts      # Cart endpoint definitions
│   ├── promoRoutes.ts     # Promo endpoint definitions
│   └── orderRoutes.ts     # Order endpoint definitions
├── scripts/
│   └── seed.ts            # Database seeding script
├── utils/
│   ├── validation.ts      # Zod validation schemas
│   └── helpers.ts         # Utility functions
├── __tests__/
│   ├── setup.ts           # Test environment setup
│   └── *.test.ts          # Test files
└── index.ts               # Application entry point
```

## Data Models

### Product Model
```typescript
interface IProduct {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  variants: IVariant[];
  images: string[];
  isActive: boolean;
}

interface IVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventory: number;
  attributes: Record<string, string>; // color, size, etc.
}
```

### Cart Model
```typescript
interface ICart {
  guestToken: string;
  items: ICartItem[];
  totalAmount: number;
  expiresAt: Date; // 7 days TTL
}

interface ICartItem {
  productId: ObjectId;
  variantId: string;
  quantity: number;
  price: number; // Price at time of adding
}
```

### Promotional Code Model
```typescript
interface IPromo {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}
```

### Order Model
```typescript
interface IOrder {
  orderNumber: string;
  guestToken: string;
  items: IOrderItem[];
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: IShippingAddress;
}

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

## Development Workflow

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npx tsc --noEmit

# Format code (if prettier is configured)
npm run format
```

### Database Operations
```bash
# Seed database with sample data
npm run seed

# Connect to MongoDB shell
mongo mongodb://localhost:27017/ecommerce

# View collections
show collections

# Query products
db.products.find().pretty()
```

### Environment Management
- Development: `NODE_ENV=development`
- Testing: `NODE_ENV=test`
- Production: `NODE_ENV=production`

## Deployment

### Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -t ecommerce-backend .
docker run -p 3000:3000 -e MONGODB_URI=mongodb://host:27017/ecommerce ecommerce-backend
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=your-production-secret-key
```

### Cloud Deployment Options
- Heroku: Easy deployment with MongoDB Atlas
- AWS: EC2 with DocumentDB or MongoDB Atlas
- Vercel: Serverless deployment
- DigitalOcean: App Platform or Droplets

## Security Considerations

### Implemented Security Measures
- Helmet.js: Security headers (XSS, CSRF protection)
- CORS: Cross-origin resource sharing configuration
- Input Validation: Comprehensive Zod schema validation
- Error Handling: Sanitized error responses
- Rate Limiting: Consider implementing for production

### Production Security Checklist
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Regular security audits (`npm audit`)
- [ ] Environment variable security
- [ ] Database connection security
- [ ] API key management

## Performance Optimization

### Database Optimization
- Indexes: Strategic indexing on frequently queried fields
- Aggregation Pipelines: Efficient data processing
- Connection Pooling: Mongoose connection management
- TTL: Automatic cart expiration

### API Performance
- Pagination: Implemented for large datasets
- Caching: Consider Redis for session management
- Compression: Gzip compression for responses
- Query Optimization: Efficient MongoDB queries

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check connection string
echo $MONGODB_URI
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### TypeScript Compilation Errors
```bash
# Clean build
rm -rf dist/
npm run build

# Check TypeScript configuration
npx tsc --showConfig
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# MongoDB debug mode
DEBUG=mongoose:* npm run dev
```

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR

### Pull Request Process
1. Update README.md with details of changes
2. Update the version numbers following [SemVer](http://semver.org/)
3. The PR will be merged once you have the sign-off of maintainers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Express.js team for the robust web framework
- MongoDB team for the flexible database solution
- TypeScript team for type safety
- Zod team for excellent validation library
- Open source community for inspiration and tools

## Support & Contact

- Issues: [GitHub Issues](https://github.com/MH-Mubin/headless-e-commerce/issues)
- Documentation: [API Docs](http://localhost:3000/api-docs)
- Email: [Contact](mailto:support@example.com)

---

Built with TypeScript, Express.js, and MongoDB
