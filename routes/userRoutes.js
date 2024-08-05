const express = require('express');
const UserController = require('../controllers/userRecord');
const router = express.Router();
const { ensureAuthenticated } = require('./userAuthorize');

router.get('/user/records', ensureAuthenticated, UserController.get_user_records);
router.post('/user/records', ensureAuthenticated, UserController.post_user_record);
router.put('/user/records/:info_id', ensureAuthenticated, UserController.update_user_record);
router.delete('/user/records/:info_id', ensureAuthenticated, UserController.delete_user_record);

module.exports = router; 