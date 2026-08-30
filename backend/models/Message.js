/**
 * Message Model
 * Stores chat messages
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ timestamp: -1 });
messageSchema.index({ senderId: 1 });

module.exports = mongoose.model('Message', messageSchema);
