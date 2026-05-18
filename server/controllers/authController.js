// server/controllers/authController.js — Login & Signup logic (Q6)

const User   = require('../models/User');
const jwt    = require('jsonwebtoken');

// ─── Helper: Generate JWT token ───────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }    // Token valid for 7 days
  );
};

// ─── POST /api/auth/register — Create a new HR/Admin account ─────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Create user (password hashed automatically via pre-save hook in model)
    const user = await User.create({ name, email, password, role });

    // Return JWT token on successful registration
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Account created successfully ✅',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── POST /api/auth/login — Login and receive JWT token ───────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate and return JWT token
    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login successful ✅',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET /api/auth/me — Get current logged-in user (protected) ───────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe };
