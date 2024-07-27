const express = require('express');
const foodController = require('../controllers/food');
const router = express.Router();

router.get('/foodinfo',foodController.get_food_info);


module.exports = router;