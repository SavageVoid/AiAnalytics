// server/routes/authRoutes.js — Auth API route definitions (Q6)

const express = require('express');
const router  = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);          // POST /api/auth/register — public
router.post('/login',    login);             // POST /api/auth/login    — public
router.get('/me',        protect, getMe);    // GET  /api/auth/me       — protected

module.exports = router;
