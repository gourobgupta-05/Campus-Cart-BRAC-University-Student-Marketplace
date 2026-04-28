import asyncHandler from '../middleware/asyncHandler.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (receiverId === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot send a message to yourself');
  }

  const message = new Message({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  const createdMessage = await message.save();
  res.status(201).json(createdMessage);
});

// @desc    Get all unique conversation partners for logged in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all messages where user is involved
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).sort({ createdAt: -1 });

  // Map to distinct users with unread flags
  const conversationsMap = {};

  for (const msg of messages) {
    const isSender = msg.sender.toString() === userId.toString();
    const partnerId = isSender ? msg.receiver.toString() : msg.sender.toString();

    if (!conversationsMap[partnerId]) {
      // First time seeing this partner (latest message because sorted desc)
      conversationsMap[partnerId] = {
        partnerId,
        latestMessage: msg.content,
        updatedAt: msg.createdAt,
        unreadCount: 0,
      };
    }

    // If I am the receiver and message is unread, increment
    if (!isSender && !msg.isRead) {
      conversationsMap[partnerId].unreadCount += 1;
    }
  }

  // Populate user details for each partner
  const conversations = Object.values(conversationsMap);
  for (const conv of conversations) {
    const user = await User.findById(conv.partnerId).select('name email');
    if (user) {
      conv.name = user.name;
    } else {
      conv.name = 'Unknown User';
    }
  }

  res.json(conversations);
});

// @desc    Get messages between logged in user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const userId1 = req.user._id;
  const userId2 = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// @desc    Mark conversation as read
// @route   PUT /api/messages/:userId/read
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const senderId = req.params.userId;
  const receiverId = req.user._id;

  // Mark all messages sent BY the partner TO me as read
  await Message.updateMany(
    { sender: senderId, receiver: receiverId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: 'Messages marked as read' });
});

export { sendMessage, getConversations, getMessages, markMessagesAsRead };
