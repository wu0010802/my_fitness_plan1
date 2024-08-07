const express = require('express')
const app = express();
const router = express.Router()
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helmet = require('helmet');

const GoogleStrategy = require('passport-google-oauth20').Strategy


const UserInfo = require('../models/UserInfo')
const UserRecord = require('../models/UserRecord')
const IntakeLogs = require('../models/IntakeLogs')

const { total_calories } = require('../controllers/intake')

app.use(helmet());

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
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


const comparePasswords = async (password, hash) => {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};


router.post('/register', async (req, res) => {
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

    res.render('addRecord', { user_id: new_user.user_id });
  } catch (error) {
    console.error('Error creating new user record:', error);
    res.status(500).json({ message: 'Failed to create new user record' });
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '594286944806-h55i3un9fr0opi1j597u8lfrds9ev73j.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback'
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
  ));





passport.use(new LocalStrategy({ usernameField: 'email' },
  async function (email, password, done) {
    try {
      const user = await UserInfo.findOne({ where: { email: email } })
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const db_hashed_password = user.password;
      const isMatch = await comparePasswords(password, db_hashed_password);
      if (!isMatch) {

        return done(null, false, { message: 'incorrect password' });
      }

      return done(null, user)
    } catch (error) {
      console.error('Error logging in:', error);
      return done(error);
    }
  }
));

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

router.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");

  }
);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), // Google OAuth 回調路由
  async (req, res) => {
    try {
     
      const user_record = await UserRecord.findAll({ where: { user_id: req.user.user_id } });
      
      
      if (user_record.length > 0) {
        res.redirect("/profile"); 
      } else {
        res.render('addRecord', { user_id: req.user.user_id }); 
      }
    } catch (error) {
      console.error('Error fetching user record:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.get('/profile', async (req, res) => {
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
});



router.get("/login", (req, res) => {
  res.render("login");
});

router.get('/register', (req, res) => {
  res.render('register')
})


router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");

  });
});

module.exports = {
  router,
  ensureAuthenticated
};



