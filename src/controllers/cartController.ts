import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { addToCartSchema, updateCartItemSchema, guestTokenSchema } from '../utils/validation';
import { generateGuestToken, formatPrice } from '../utils/helpers';

export const createCart = async (req: Request, res: Response) => {
  try {
    const guestToken = generateGuestToken();
    
    const cart = new Cart({
      guestToken,
      items: [],
      totalAmount: 0
    });

    await cart.save();

    return res.status(201).json({
      success: true,
      data: {
        guestToken,
        cart
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create cart'
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);

    const cart = await Cart.findOne({ guestToken }).populate({
      path: 'items.productId',
      select: 'name images variants'
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Calculate current total with populated product data
    let totalAmount = 0;
    const enrichedItems = cart.items.map(item => {
      const product = item.productId as any;
      const variant = product.variants.find((v: any) => v.id === item.variantId);
      
      const itemTotal = item.quantity * item.price;
      totalAmount += itemTotal;

      return {
        ...(item as any).toObject(),
        product: {
          _id: product._id,
          name: product.name,
          images: product.images
        },
        variant: variant || null,
        itemTotal: formatPrice(itemTotal)
      };
    });

    return res.json({
      success: true,
      data: {
        ...cart.toObject(),
        items: enrichedItems,
        totalAmount: formatPrice(totalAmount)
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch cart'
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);
    const { productId, variantId, quantity } = addToCartSchema.parse(req.body);

    // Find the product and variant
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Product variant not found'
      });
    }

    // Check inventory
    if (variant.inventory < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient inventory'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ guestToken });
    if (!cart) {
      cart = new Cart({
        guestToken,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantId === variantId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (variant.inventory < newQuantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient inventory for requested quantity'
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        variantId,
        quantity,
        price: variant.price
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    return res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to add item to cart'
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { guestToken, productId, variantId } = req.params;
    const { quantity } = updateCartItemSchema.parse(req.body);

    guestTokenSchema.parse({ guestToken });

    const cart = await Cart.findOne({ guestToken });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantId === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Check inventory
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant || variant.inventory < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient inventory'
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    return res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to update cart item'
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { guestToken, productId, variantId } = req.params;

    guestTokenSchema.parse({ guestToken });

    const cart = await Cart.findOne({ guestToken });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantId === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    return res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to remove item from cart'
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);

    const cart = await Cart.findOne({ guestToken });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    return res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to clear cart'
    });
  }
};
