import { Request, Response } from 'express';
import Product from '../models/Product';
import { createProductSchema, productQuerySchema } from '../utils/validation';
import { isValidObjectId } from '../utils/helpers';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = productQuerySchema.parse(req.query);
    const { page, limit, category, search, minPrice, maxPrice } = query;

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: { isActive: true } }
    ];

    // Add category filter
    if (category) {
      pipeline[0].$match.category = category;
    }

    // Add price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceMatch: any = {};
      if (minPrice !== undefined) priceMatch.$gte = minPrice;
      if (maxPrice !== undefined) priceMatch.$lte = maxPrice;
      pipeline[0].$match.basePrice = priceMatch;
    }

    // Add text search
    if (search) {
      pipeline.unshift({ $match: { $text: { $search: search } } });
    }

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // Execute aggregation
    const products = await Product.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove skip and limit
    countPipeline.push({ $count: "total" });
    
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch products'
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const product = new Product(validatedData);
    await product.save();

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create product'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const validatedData = createProductSchema.partial().parse(req.body);

    const product = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to update product'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    // Soft delete by setting isActive to false
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete product'
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        productCount: cat.count
      }))
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch categories'
    });
  }
};
