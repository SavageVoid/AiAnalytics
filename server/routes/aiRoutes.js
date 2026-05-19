

const express = require('express');
const router  = express.Router();
const { getRecommendation, rankEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getRecommendation);  
router.get('/rank',       protect, rankEmployees);       

module.exports = router;
