import { Request, Response } from 'express';
import Promo, { PromoType } from '../models/Promo';
import Cart from '../models/Cart';
import { createPromoSchema, applyPromoSchema, guestTokenSchema } from '../utils/validation';
import { calculateDiscountAmount, formatPrice } from '../utils/helpers';

export const createPromo = async (req: Request, res: Response) => {
  try {
    const validatedData = createPromoSchema.parse(req.body);

    const promo = new Promo({
      ...validatedData,
      validFrom: new Date(validatedData.validFrom),
      validUntil: new Date(validatedData.validUntil)
    });

    await promo.save();

    return res.status(201).json({
      success: true,
      data: promo
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create promo'
    });
  }
};

export const getPromos = async (req: Request, res: Response) => {
  try {
    const promos = await Promo.find({ isActive: true }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: promos
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch promos'
    });
  }
};

export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { promoCode } = applyPromoSchema.parse(req.body);
    const { guestToken } = guestTokenSchema.parse(req.params);

    // Find the cart
    const cart = await Cart.findOne({ guestToken });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Find the promo
    const promo = await Promo.findOne({ 
      code: promoCode.toUpperCase(),
      isActive: true 
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        error: 'Invalid promo code'
      });
    }

    // Check validity window
    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has expired or is not yet valid'
      });
    }

    // Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({
        success: false,
        error: 'Promo code usage limit exceeded'
      });
    }

    // Check minimum order amount
    if (promo.minimumOrderAmount && cart.totalAmount < promo.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${promo.minimumOrderAmount} required`
      });
    }

    // Calculate discount
    const discountAmount = calculateDiscountAmount(
      cart.totalAmount,
      promo.type,
      promo.value,
      promo.maxDiscountAmount
    );

    const finalTotal = formatPrice(cart.totalAmount - discountAmount);

    return res.json({
      success: true,
      data: {
        promo: {
          code: promo.code,
          name: promo.name,
          type: promo.type,
          value: promo.value
        },
        subtotal: formatPrice(cart.totalAmount),
        discountAmount: formatPrice(discountAmount),
        finalTotal
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to validate promo'
    });
  }
};

export const applyPromo = async (req: Request, res: Response) => {
  try {
    const { promoCode } = applyPromoSchema.parse(req.body);
    const { guestToken } = guestTokenSchema.parse(req.params);

    // Find the cart
    const cart = await Cart.findOne({ guestToken });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Find the promo
    const promo = await Promo.findOne({ 
      code: promoCode.toUpperCase(),
      isActive: true 
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        error: 'Invalid promo code'
      });
    }

    // Validate promo (same logic as validatePromo)
    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has expired or is not yet valid'
      });
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({
        success: false,
        error: 'Promo code usage limit exceeded'
      });
    }

    if (promo.minimumOrderAmount && cart.totalAmount < promo.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${promo.minimumOrderAmount} required`
      });
    }

    // Calculate discount
    const discountAmount = calculateDiscountAmount(
      cart.totalAmount,
      promo.type,
      promo.value,
      promo.maxDiscountAmount
    );

    // Store promo info in cart (we'll add these fields to the cart model)
    (cart as any).appliedPromo = {
      code: promo.code,
      discountAmount: formatPrice(discountAmount)
    };

    await cart.save();

    const finalTotal = formatPrice(cart.totalAmount - discountAmount);

    return res.json({
      success: true,
      data: {
        cart,
        appliedPromo: {
          code: promo.code,
          name: promo.name,
          discountAmount: formatPrice(discountAmount)
        },
        subtotal: formatPrice(cart.totalAmount),
        discountAmount: formatPrice(discountAmount),
        finalTotal
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to apply promo'
    });
  }
};

export const removePromo = async (req: Request, res: Response) => {
  try {
    const { guestToken } = guestTokenSchema.parse(req.params);

    const cart = await Cart.findOne({ guestToken });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Remove applied promo
    (cart as any).appliedPromo = undefined;
    await cart.save();

    return res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to remove promo'
    });
  }
};
