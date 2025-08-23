import { v4 as uuidv4 } from 'uuid';

export const generateGuestToken = (): string => {
  return uuidv4();
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const calculateDiscountAmount = (
  subtotal: number,
  promoType: 'percentage' | 'fixed',
  promoValue: number,
  maxDiscountAmount?: number
): number => {
  let discount = 0;
  
  if (promoType === 'percentage') {
    discount = (subtotal * promoValue) / 100;
    if (maxDiscountAmount && discount > maxDiscountAmount) {
      discount = maxDiscountAmount;
    }
  } else {
    discount = Math.min(promoValue, subtotal);
  }
  
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

export const formatPrice = (price: number): number => {
  return Math.round(price * 100) / 100;
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
