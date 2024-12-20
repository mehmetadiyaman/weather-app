const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
router.get('/', weatherController.renderHomePage);
router.get('/api/weather/:city', weatherController.getCurrentWeather);
module.exports = router;