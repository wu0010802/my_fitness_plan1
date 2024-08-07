const express = require('express');
const UserController = require('../controllers/userRecord');
const router = express.Router();
const { ensureAuthenticated } = require('./userAuthorize');

router.get('/user/records', ensureAuthenticated, UserController.get_user_records);
router.put('/user/records/:info_id', ensureAuthenticated, UserController.update_user_record);
router.delete('/user/records/:info_id', ensureAuthenticated, UserController.delete_user_record);


router.post('/user/records', ensureAuthenticated, async (req, res) => {
    try {
      const record = await UserController.post_user_record(req);
      res.status(201).json(record);
    } catch (error) {
      console.error('Error during post_user_record execution:', error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  });







  router.post('/register/records/:user_id', async (req, res) => {
    try {
      const record = await UserController.post_user_record(req);
      
      
      if (!res.headersSent) {
        res.redirect('/profile');
      }
    } catch (error) {
      console.error('Error during post_user_record execution:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'An error occurred while processing your request' });
      }
    }
  });




module.exports = router; 