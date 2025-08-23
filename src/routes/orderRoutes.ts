import { Router } from 'express';
import {
  createOrder,
  getOrder,
  getOrdersByGuestToken,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController';

const router = Router();

/**
 * @swagger
 * /api/orders/{guestToken}:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
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
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - email
 *                   - phone
 *                   - address
 *                   - city
 *                   - state
 *                   - zipCode
 *                   - country
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/:guestToken', createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /api/orders/guest/{guestToken}:
 *   get:
 *     summary: Get orders by guest token
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/guest/:guestToken', getOrdersByGuestToken);

/**
 * @swagger
 * /api/orders/{orderNumber}:
 *   get:
 *     summary: Get order by order number
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/:orderNumber', getOrder);

/**
 * @swagger
 * /api/orders/{orderNumber}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderNumber
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.put('/:orderNumber/status', updateOrderStatus);

export default router;
