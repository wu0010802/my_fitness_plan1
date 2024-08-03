const express = require('express');
const foodController = require('../controllers/food');
const router = express.Router();

router.get('/api/food',foodController.get_post_food_info);//?food=food_name


module.exports = router;