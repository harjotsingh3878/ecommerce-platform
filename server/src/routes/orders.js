import express from 'express';
import {
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserOrders);
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
