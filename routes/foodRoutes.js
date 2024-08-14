const express = require('express');
const foodController = require('../controllers/food');
const router = express.Router();
const {ensureAuthenticated} = require('./userAuthorize');

router.get('/api/food',ensureAuthenticated,foodController.get_post_food_info);
router.get('/api/frequentfood',ensureAuthenticated,foodController.get_most_frequent_query_food);


module.exports = router;