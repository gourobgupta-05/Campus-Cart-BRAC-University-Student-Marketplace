import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/mine').get(protect, getMyProducts);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, checkObjectId, updateProduct)
  .delete(protect, checkObjectId, deleteProduct);

export default router;
