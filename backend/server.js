/**
 * Chat Application Backend Server
 * Real-time messaging with Socket.io and Express
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes and middleware
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const connectDB = require('./config/db');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`📱 New user connected: ${socket.id}`);

  // Store user info
  let currentUser = null;

  // User authentication and join
  socket.on('user_join', (data) => {
    currentUser = data;
    socket.username = data.username;
    socket.userId = data.userId;

    // Broadcast user joined
    io.emit('user_joined', {
      username: data.username,
      message: `${data.username} joined the chat`,
      timestamp: new Date(),
    });

    console.log(`✅ ${data.username} joined the chat`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const Message = require('./models/Message');

      // Save message to database
      const newMessage = new Message({
        sender: socket.username,
        senderId: socket.userId,
        message: data.message,
        timestamp: new Date(),
      });

      await newMessage.save();

      // Broadcast message to all connected clients
      io.emit('receive_message', {
        sender: socket.username,
        senderId: socket.userId,
        message: data.message,
        timestamp: new Date(),
        _id: newMessage._id,
      });

      console.log(`💬 Message from ${socket.username}: ${data.message}`);
    } catch (error) {
      console.error('❌ Error saving message:', error);
      socket.emit('error', { message: 'Failed to save message' });
    }
  });

  // Handle typing indicator (optional)
  socket.on('user_typing', (data) => {
    socket.broadcast.emit('user_typing', {
      username: socket.username,
      isTyping: data.isTyping,
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentUser) {
      io.emit('user_left', {
        username: currentUser.username,
        message: `${currentUser.username} left the chat`,
        timestamp: new Date(),
      });

      console.log(`👋 ${currentUser.username} disconnected`);
    }
    console.log(`🔌 User ${socket.id} disconnected`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`✅ Connected to MongoDB`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io listening on ws://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;
