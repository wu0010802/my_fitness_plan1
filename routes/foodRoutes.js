const express = require('express');
const foodController = require('../controllers/food');
const router = express.Router();
const {ensureAuthenticated} = require('./userAuthorize');
// 返回第三方資料庫的營養資料
router.get('/api/food',ensureAuthenticated,foodController.get_post_food_info);
router.get('/api/frequentfood',ensureAuthenticated,foodController.get_most_frequent_query_food);


module.exports = router;