const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();

router.get('/user/records', UserController.get_user_records);//可以加上 ?user_id=
router.post('/user/:id/records', UserController.post_user_record);
router.put('/user/:id/records', UserController.update_user_record);
router.delete('/user/:id/records', UserController.delete_user_record);

module.exports = router;