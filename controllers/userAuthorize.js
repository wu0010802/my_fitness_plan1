const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs');
const passport = require("passport");
require('dotenv').config({ path: '.env.dev' });

const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const UserInfo = require('../models/UserInfo')
const UserRecord = require('../models/UserRecord')

const { total_calories } = require('../controllers/intake')
const isProduction = process.env.NODE_ENV === 'production';

const comparePasswords = async (password, hash) => {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

const passwordHash = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
  }
  return null;
};
// google成功登入後導向至render_profile或addRecord畫面
const redirect_profile_or_addRecord = async (req, res, next) => {
  try {
    const user_record = await UserRecord.findAll({ where: { user_id: req.user.user_id } });

    if (user_record.length > 0) {
      res.redirect("/profile");
    } else {

      req.login(req.user, function (err) {
        if (err) {
          return next(err);
        }
        res.render('addRecord', { user_id: req.user.user_id });
      });
    }
  } catch (error) {
    console.error('Error fetching user record:', error);
    res.status(500).send('Internal Server Error');
  }
}


// 渲染主頁面
const render_profile = async (req, res) => {
  if (req.isAuthenticated()) {
    try {

      const user_records = await UserRecord.findAll({
        where: { user_id: req.user.user_id },
        order: [['date', 'DESC']],
        limit: 1
      });


      const today_calories = await total_calories(req, res);
      const fixed_calories = today_calories.toFixed(2)
      const user_record = user_records[0] ? user_records[0].dataValues : null;
      const Calories_remaining = (user_record.tdee - today_calories).toFixed(2)

      if (user_record) {
        res.render('profile', {
          user: {
            ...req.user,
            height: user_record.height,
            weight: user_record.weight,
            record_date: user_record.date,
            Calories_remaining: Calories_remaining,
            calories: fixed_calories

          }

        })

      } else {
        res.render('profile', { user: req.user, message: 'No records found' });
      }
    } catch (error) {
      console.error('Error fetching user records:', error);
      res.status(500).json({ message: 'Failed to load user records' });
    }
  } else {
    res.redirect('/login');
  }
}


// 本地註冊
const local_regiser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;


  if (password !== confirmPassword) {
    return res.json({ message: 'Passwords do not match' });
  }

  try {
    const user = await UserInfo.findOne({ where: { email } });

    if (user) {
      return res.json({ message: 'User has already been registered' });
    }

    const hashedPassword = await passwordHash(password);

    if (!hashedPassword) {
      return res.status(500).json({ message: 'Failed to hash password' });
    }

    const new_user = await UserInfo.create({
      username: username,
      email: email,
      password: hashedPassword
    });
    await sendVerificationEmail(new_user);

    res.json({ message: 'User registered successfully. Please verify your email.' });



  } catch (error) {
    console.error('Error creating new user record:', error);
    res.status(500).json({ message: 'Failed to create new user record' });
  }
}

const Local_strategy = new LocalStrategy({ usernameField: 'email' },
  async function (email, password, done) {
    try {
      const user = await UserInfo.findOne({ where: { email: email } });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      if (!user.isEmailVerified) {
        return done(null, false, { message: 'Please verify your email before logging in.' });
      }

      const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      console.error('Error logging in:', error);
      return done(error);
    }
  }
);


const Google_strategy = new GoogleStrategy(
  {
    clientID:
      process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: isProduction ? process.env.callbackURL : process.env.local_callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      let user = await UserInfo.findOne({ where: { email: profile.emails[0].value } });

      if (user) {

        return done(null, user);
      } else {

        user = await UserInfo.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: 'google',
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
)



passport.use(Google_strategy);
passport.use(Local_strategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});
passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await UserInfo.findByPk(user_id, {
      attributes: ['user_id', 'username', 'email']
    });

    done(null, user.dataValues);
  } catch (err) {
    done(err);
  }
});



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const generateVerificationToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId: user.user_id }, secret, { expiresIn: '1h' });
  return token;
};


const sendVerificationEmail = async (user) => {
  const token = generateVerificationToken(user);
  const isProduction = process.env.NODE_ENV === 'production';

  const verificationUrl = isProduction
    ? `${process.env.BASE_URL}/verify-email?token=${token}`
    : `http://localhost:3000/verify-email?token=${token}`;
  

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: '請驗證您的信箱',
    html: `<p>請點擊下方連結驗證您的信箱：</p><a href="${verificationUrl}">驗證連結</a>`,
  };

  await transporter.sendMail(mailOptions);
};


const email_verified = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Invalid or missing token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserInfo.findByPk(decoded.userId);

    if (!user) {
      return res.status(400).send('Invalid user');
    }

    user.isEmailVerified = true;
    await user.save();

    req.login(user, function (err) { 
      if (err) {
        return next(err); 
      }

      
      res.render('addRecord', { user_id: user.user_id });
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send('Failed to verify email. Token may have expired.');
  }
};



module.exports = {
        local_regiser,
        render_profile,
        redirect_profile_or_addRecord,
        email_verified
      }