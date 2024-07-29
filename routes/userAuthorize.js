const express = require('express')
const app = express();
const router = express.Router()
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helmet = require('helmet');

const UserInfo = require('../models/UserInfo')

app.use(helmet());

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

    await UserInfo.create({
      username: username,
      email: email,
      password: hashedPassword
    });

    // res.json({ message: 'User registered successfully' });
    res.render('login')
  } catch (error) {
    console.error('Error creating new user record:', error);
    res.status(500).json({ message: 'Failed to create new user record' });
  }
});


router.use(
  session({
    secret: "fitness",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store: store
  })
)

router.use(passport.initialize());
router.use(passport.session());


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


router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user, msg: 'hi' });
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


module.exports = router



