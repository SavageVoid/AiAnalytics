// server/routes/aiRoutes.js — AI API route definitions (Q5)

const express = require('express');
const router  = express.Router();
const { getRecommendation, rankEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getRecommendation);  // POST /api/ai/recommend
router.get('/rank',       protect, rankEmployees);       // GET  /api/ai/rank

module.exports = router;
