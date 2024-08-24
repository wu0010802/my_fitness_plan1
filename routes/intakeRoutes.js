const {ensureAuthenticated} = require('./userAuthorize');
const intakeController = require('../controllers/intake');
const express = require('express');
const router = express.Router();



router.get('/user/intake', ensureAuthenticated, intakeController.get_user_intakelogs); 
// 根據food_name, amount 新增攝取
router.post('/user/intake', ensureAuthenticated, intakeController.post_user_intakelogs);
router.delete('/user/intake/:log_id',ensureAuthenticated,intakeController.delete_user_intakelog);
// 根據amount 修改攝取
router.put('/user/intake/:log_id',ensureAuthenticated,intakeController.update_user_intakelog);

module.exports = router;
