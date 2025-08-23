import mongoose, { Document, Schema } from 'mongoose';

export enum PromoType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}

export interface IPromo extends Document {
  code: string;
  name: string;
  type: PromoType;
  value: number; // Percentage (0-100) or fixed amount
  minimumOrderAmount?: number;
  maxDiscountAmount?: number; // For percentage discounts
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema<IPromo>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: Object.values(PromoType), required: true },
  value: { type: Number, required: true, min: 0 },
  minimumOrderAmount: { type: Number, min: 0 },
  maxDiscountAmount: { type: Number, min: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
PromoSchema.index({ code: 1 });
PromoSchema.index({ validFrom: 1, validUntil: 1 });
PromoSchema.index({ isActive: 1 });

// Validation
PromoSchema.pre('save', function(next) {
  if (this.validFrom >= this.validUntil) {
    next(new Error('Valid from date must be before valid until date'));
  }
  if (this.type === PromoType.PERCENTAGE && this.value > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  next();
});

export default mongoose.model<IPromo>('Promo', PromoSchema);
