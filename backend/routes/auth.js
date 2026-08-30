/**
 * Authentication Routes
 * Handles user registration, login, and email verification
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper function to generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with that email or username' });
    }

    // Generate email verification token
    const emailVerificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      emailVerificationToken,
      isEmailVerified: false,
    });

    await newUser.save();

    // Generate JWT token for auto-login
    const token = generateToken(newUser);

    console.log(`✅ New user registered: ${username}`);
    console.log(`📧 Email verification token: ${emailVerificationToken}`);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
      },
      verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`,
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify user's email address
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and update verification status
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    console.log(`✅ Email verified for: ${user.email}`);

    res.json({ message: 'Email verified successfully!', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.status(400).json({ message: 'Invalid or expired verification token' });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    console.log(`✅ User logged in: ${user.username}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
