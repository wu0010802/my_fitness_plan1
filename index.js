const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./database/sequelize')
const cors = require('cors');
const port = process.env.PORT || 3000
const path = require('path');

const passport = require("passport");
const session = require("express-session");
const store = new session.MemoryStore();

const exphbs = require('express-handlebars');



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


app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
const {router:userAuthorizeRoutes} = require('./routes/userAuthorize');

app.use('/', userRoutes)
app.use('/', foodRoutes)
app.use('/', intakeRoutes)
app.use('/', userAuthorizeRoutes)

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database & tables created or updated!');

    app.listen(port, () => {
      console.log(`App running on port ${port}.`);
    });
  } catch (error) {
    console.error('Failed to sync database:', error);
    process.exit(1);
  }
};

startServer();

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});



const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));





