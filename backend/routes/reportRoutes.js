import express from 'express';
const router = express.Router();
import {
  createReport,
  getReports,
  resolveReport,
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createReport).get(protect, admin, getReports);
router.route('/:id/resolve').put(protect, admin, resolveReport);

export default router;
