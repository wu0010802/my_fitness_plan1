const express = require('express');
const UserController = require('../controllers/userRecord');
const router = express.Router();
const { ensureAuthenticated } = require('./userAuthorize');

// 回傳userRecords物件包括info_id
router.get('/user/records', ensureAuthenticated, UserController.get_user_records);

// 根據height,age,gender,weight,exercise_per_week更新資料
router.put('/user/records/:info_id', ensureAuthenticated, UserController.update_user_record);

// 根據infoId刪除使用者資料
router.delete('/user/records/:info_id', ensureAuthenticated, UserController.delete_user_record);

// 登入後用戶註冊使用者資訊 根據body(height, weight, age, gender, exercise_per_week)
router.post('/user/records', ensureAuthenticated,UserController.post_user_record_after_login);

// 登入前用戶註冊使用者資訊 根據根據body(height, weight, age, gender, exercise_per_week)
router.post('/register/records/:user_id', UserController.post_user_record_before_login);

module.exports = router; 