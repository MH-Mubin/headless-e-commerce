import { Request, Response } from 'express';
import Order, { OrderStatus } from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Promo from '../models/Promo';
import { createOrderSchema, guestTokenSchema } from '../utils/validation';
import { generateOrderNumber, calculateDiscountAmount, formatPrice } from '../utils/helpers';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);
    const { shippingAddress } = createOrderSchema.parse(req.body);

    // Find the cart
    const cart = await Cart.findOne({ guestToken }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Validate inventory and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.productId as any;
      const variant = product.variants.find((v: any) => v.id === cartItem.variantId);

      if (!variant) {
        return res.status(400).json({
          success: false,
          error: `Variant not found for product ${product.name}`
        });
      }

      if (variant.inventory < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient inventory for ${product.name} - ${variant.name}`
        });
      }

      const itemTotal = cartItem.quantity * cartItem.price;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        variantId: cartItem.variantId,
        productName: product.name,
        variantName: variant.name,
        quantity: cartItem.quantity,
        unitPrice: cartItem.price,
        totalPrice: formatPrice(itemTotal)
      });
    }

    // Handle promo code if applied
    let discountAmount = 0;
    let promoCode = undefined;

    if ((cart as any).appliedPromo) {
      const appliedPromo = (cart as any).appliedPromo;
      promoCode = appliedPromo.code;
      discountAmount = appliedPromo.discountAmount;

      // Increment promo usage count
      await Promo.findOneAndUpdate(
        { code: promoCode },
        { $inc: { usedCount: 1 } }
      );
    }

    const totalAmount = formatPrice(subtotal - discountAmount);

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      guestToken,
      items: orderItems,
      subtotal: formatPrice(subtotal),
      discountAmount: formatPrice(discountAmount),
      promoCode,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress
    });

    await order.save();

    // Update product inventory
    for (const cartItem of cart.items) {
      const product = cartItem.productId as any;
      const variantIndex = product.variants.findIndex((v: any) => v.id === cartItem.variantId);
      
      if (variantIndex > -1) {
        product.variants[variantIndex].inventory -= cartItem.quantity;
        await product.save();
      }
    }

    // Clear the cart
    await Cart.findByIdAndDelete(cart._id);

    return res.status(201).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order'
    });
  }
};

export const getOrdersByGuestToken = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);

    const orders = await Order.find({ guestToken })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images');

    return res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to update order status'
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.productId', 'name images');

    const total = await Order.countDocuments(filter);

    return res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
};
