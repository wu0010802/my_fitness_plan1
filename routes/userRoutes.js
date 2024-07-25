const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();

router.get('/user/:id/records', UserController.get_user_records);




module.exports = router;