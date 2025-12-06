import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  getStripeConfig
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
