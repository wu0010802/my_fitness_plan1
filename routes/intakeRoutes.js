const {ensureAuthenticated} = require('./userAuthorize');
const intakeController = require('../controllers/intake');
const express = require('express');
const router = express.Router();



router.get('/user/intake', ensureAuthenticated, intakeController.get_user_intakelogs); 
router.post('/user/intake', ensureAuthenticated, intakeController.post_user_intakelogs);
router.delete('/user/intake/:log_id',ensureAuthenticated,intakeController.delete_user_intakelog);
router.put('/user/intake/:log_id',ensureAuthenticated,intakeController.update_user_intakelog);

module.exports = router;
