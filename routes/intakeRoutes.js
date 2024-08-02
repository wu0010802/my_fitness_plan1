const express = require('express');
const intakeController = require('../controllers/intake');
const router = express.Router();

router.get('/user/intake', intakeController.get_user_intakelogs_by_user_date);//可以加上 ?user_id,?date
router.post('/user/intake/:user_id/:food_id', intakeController.post_user_intakelogs);






module.exports = router;