import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.string().min(1, 'Category is required').max(100),
  basePrice: z.number().min(0, 'Base price must be non-negative'),
  variants: z.array(z.object({
    id: z.string().min(1, 'Variant ID is required'),
    name: z.string().min(1, 'Variant name is required'),
    price: z.number().min(0, 'Variant price must be non-negative'),
    sku: z.string().min(1, 'SKU is required'),
    inventory: z.number().int().min(0, 'Inventory must be non-negative integer'),
    attributes: z.record(z.string()).optional().default({})
  })).min(1, 'At least one variant is required'),
  images: z.array(z.string().url()).optional().default([]),
  isActive: z.boolean().optional().default(true)
});

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

// Promo validation schemas
export const createPromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required').max(50).regex(/^[A-Z0-9_-]+$/, 'Promo code can only contain uppercase letters, numbers, underscores, and hyphens'),
  name: z.string().min(1, 'Promo name is required').max(200),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0, 'Value must be non-negative'),
  minimumOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  validFrom: z.string().datetime('Invalid date format for validFrom'),
  validUntil: z.string().datetime('Invalid date format for validUntil'),
  usageLimit: z.number().int().min(1).optional(),
  isActive: z.boolean().optional().default(true)
}).refine(data => {
  if (data.type === 'percentage' && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: 'Percentage discount cannot exceed 100%',
  path: ['value']
}).refine(data => {
  const validFrom = new Date(data.validFrom);
  const validUntil = new Date(data.validUntil);
  return validFrom < validUntil;
}, {
  message: 'Valid from date must be before valid until date',
  path: ['validUntil']
});

export const applyPromoSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required').max(50)
});

// Order validation schemas
export const createOrderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email format').max(200),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
    address: z.string().min(1, 'Address is required').max(500),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(100),
    zipCode: z.string().min(1, 'Zip code is required').max(20),
    country: z.string().min(1, 'Country is required').max(100)
  })
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1).refine(val => val > 0, 'Page must be positive'),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});

export const productQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined)
});

// Guest token validation
export const guestTokenSchema = z.object({
  guestToken: z.string().uuid('Invalid guest token format')
});
