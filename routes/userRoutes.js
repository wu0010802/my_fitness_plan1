const express = require('express');
const UserController = require('../controllers/userRecord');
const router = express.Router();
const { ensureAuthenticated } = require('./userAuthorize');

router.get('/user/records', ensureAuthenticated, UserController.get_user_records);


router.put('/user/records/:info_id', ensureAuthenticated, UserController.update_user_record);


router.delete('/user/records/:info_id', ensureAuthenticated, UserController.delete_user_record);

// 登入後用戶註冊使用者資訊
router.post('/user/records', ensureAuthenticated,UserController.post_user_record_after_login);



// 登入前用戶註冊使用者資訊
router.post('/register/records/:user_id', UserController.post_user_record_before_login);




module.exports = router; 