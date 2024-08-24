const express = require('express')
const router = express.Router()
const passport = require("passport");

const userAuthorizeController = require('../controllers/userAuthorize')

require('dotenv').config({ path: '.env.dev' });

const isProduction = process.env.NODE_ENV === 'production';

// 根據username, email, password, confirmPassword註冊
router.post('/register', userAuthorizeController.local_regiser);

//  本地認證登入
router.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");

  }
);

// 第三方goolge登入
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  userAuthorizeController.redirect_profile_or_addRecord);


router.get('/profile', userAuthorizeController.render_profile);

// 渲染頁面並根據環境附加url至login.hbs
router.get("/login", (req, res) => {
  res.render("login", {
    url:  isProduction ? process.env.renderGoogleURL:process.env.LOCAL_GOOGLE_LOGIN_URL
  });
});

router.get('/register', (req, res) => {
  res.render('register')
})


router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");

  });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = {
  router,
  ensureAuthenticated
};



