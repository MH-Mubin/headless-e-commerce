import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  variantId: string;
  quantity: number;
  price: number; // Price at time of adding to cart
}

export interface ICart extends Document {
  guestToken: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const CartSchema = new Schema<ICart>({
  guestToken: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, default: 0, min: 0 },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

// Index for guest token lookup
CartSchema.index({ guestToken: 1 });

export default mongoose.model<ICart>('Cart', CartSchema);
