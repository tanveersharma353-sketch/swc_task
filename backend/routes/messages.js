/**
 * Message Routes
 * Handles fetching chat history
 */

const express = require('express');
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/messages
 * Fetch chat history with pagination
 * Query params: limit (default 50), skip (default 0)
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    // Fetch messages sorted by timestamp (newest first)
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .select('sender senderId message timestamp isEdited editedAt')
      .lean(); // Use lean() for better performance

    // Reverse to get chronological order
    messages.reverse();

    // Get total count for pagination
    const totalMessages = await Message.countDocuments();

    res.json({
      messages,
      pagination: {
        total: totalMessages,
        limit,
        skip,
        hasMore: skip + limit < totalMessages,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch messages' });
  }
});

/**
 * GET /api/messages/:userId
 * Fetch direct messages between two users
 */
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, 'recipient': userId },
        { senderId: userId, 'recipient': currentUserId },
      ],
    })
      .sort({ timestamp: 1 })
      .select('sender senderId message timestamp isEdited editedAt')
      .lean();

    res.json({ messages });
  } catch (error) {
    console.error('❌ Error fetching user messages:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/messages/:messageId
 * Delete a message (only by sender)
 */
router.delete('/:messageId', verifyToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only allow deletion by message sender
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
