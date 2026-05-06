import express from 'express';
const router = express.Router();
import {
  sendMessage,
  getConversations,
  getMessages,
  markMessagesAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, sendMessage);
router.route('/conversations').get(protect, getConversations);
router.route('/:userId').get(protect, getMessages);
router.route('/:userId/read').put(protect, markMessagesAsRead);

export default router;
