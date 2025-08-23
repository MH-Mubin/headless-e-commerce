import { Router } from 'express';
import {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Create a new cart for guest user
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Cart created successfully
 */
router.post('/', createCart);

/**
 * @swagger
 * /api/cart/{guestToken}:
 *   get:
 *     summary: Get cart by guest token
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 */
router.get('/:guestToken', getCart);

/**
 * @swagger
 * /api/cart/{guestToken}/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - variantId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 */
router.post('/:guestToken/items', addToCart);

/**
 * @swagger
 * /api/cart/{guestToken}/items/{productId}/{variantId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 */
router.put('/:guestToken/items/:productId/:variantId', updateCartItem);

/**
 * @swagger
 * /api/cart/{guestToken}/items/{productId}/{variantId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 */
router.delete('/:guestToken/items/:productId/:variantId', removeFromCart);

/**
 * @swagger
 * /api/cart/{guestToken}/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/:guestToken/clear', clearCart);

export default router;
