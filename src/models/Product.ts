import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventory: number;
  attributes: Record<string, string>; // e.g., { color: 'red', size: 'M' }
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  variants: IVariant[];
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  inventory: { type: Number, required: true, min: 0 },
  attributes: { type: Map, of: String, default: {} }
});

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  variants: [VariantSchema],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ 'variants.sku': 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
