const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userdb = require('./controllers/userqueries');
const fooddb = require('./controllers/foodqueries');
const nutrition = require('./controllers/intake')
const cors = require('cors');
const port = process.env.PORT || 3000
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)




app.use(
  session({
    secret: "fitness",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store: store
  })
)

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function (username, password, done) {
    db.users.findByUsername(username, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user)
    })
  }
))


passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
  db.users.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);

  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/profile", (req, res) => {
  // Pass user object stored in session to the view page:
  res.render("profile", { user: req.user });
});
app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("profile");
  }
);

const passwordHash = async (password, saltRounds) => {
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




function createUser(user) {
  return new Promise((resolve, reject) => {
    const newUser = {
      // getNewId creates an updated ID 
      // for the new user
      id: getNewId(records),
      ...user,
    };
    records = [newUser, ...records];
    resolve(newUser);
  });
};
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const newUser = await db.users.createUser({ username, password });
  if (newUser) {
    res.status(201).json({
      msg: "Insert Success Message Here",
      insertDataHere
    });
  } else {
    res.status(500).json({ msg: "Insert Failure Message Here" });
  }}
)




app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


// // 用戶登入邏輯
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   db.users.findByUsername(username, (err, user) => {
//     if (!user) return res.status(403).json({ msg: "No user found!" });
//     if (user.password === password) {
//       // Add your authenticated property below:
//       req.session.authenticated = true;
//       // Add the user object below:
//       req.session.user = {
//         username,
//         password,
//       }
//     }
//     console.log(req.session)
//   })
// })
// // 受保護路徑
// function authorizedUser(req, res, next) {

//   if (req.session.authorized) {

//     res.next();
//   else {
//       res.status(403).json({ msg: "You're not authorized to view this page" });
//     }
//   }
// };






















app.get('/users', userdb.get_users_info);
app.get('/users/:name', userdb.get_users_info_by_name);
app.put('/users/:name', userdb.update_user_info);
app.post('/users', userdb.post_user_info);
app.delete('/users/:name', userdb.deleteUser);
app.get('/food_info/:food', fooddb.get_food_info);
app.post('/intake', nutrition.post_intake);
// app.get('/intake',nutrition.get_daily_intake_nutrition);
app.get('/intake_list', nutrition.get_daily_intake_list);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});



