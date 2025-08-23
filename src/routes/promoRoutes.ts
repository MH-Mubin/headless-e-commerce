import { Router } from 'express';
import {
  createPromo,
  getPromos,
  validatePromo,
  applyPromo,
  removePromo
} from '../controllers/promoController';

const router = Router();

/**
 * @swagger
 * /api/promos:
 *   post:
 *     summary: Create a new promo code
 *     tags: [Promos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - type
 *               - value
 *               - validFrom
 *               - validUntil
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Promo created successfully
 */
router.post('/', createPromo);

/**
 * @swagger
 * /api/promos:
 *   get:
 *     summary: Get all active promos
 *     tags: [Promos]
 *     responses:
 *       200:
 *         description: Promos retrieved successfully
 */
router.get('/', getPromos);

/**
 * @swagger
 * /api/promos/{guestToken}/validate:
 *   post:
 *     summary: Validate promo code for cart
 *     tags: [Promos]
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
 *               - promoCode
 *             properties:
 *               promoCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promo validated successfully
 */
router.post('/:guestToken/validate', validatePromo);

/**
 * @swagger
 * /api/promos/{guestToken}/apply:
 *   post:
 *     summary: Apply promo code to cart
 *     tags: [Promos]
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
 *               - promoCode
 *             properties:
 *               promoCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promo applied successfully
 */
router.post('/:guestToken/apply', applyPromo);

/**
 * @swagger
 * /api/promos/{guestToken}/remove:
 *   delete:
 *     summary: Remove applied promo from cart
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: guestToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promo removed successfully
 */
router.delete('/:guestToken/remove', removePromo);

export default router;
