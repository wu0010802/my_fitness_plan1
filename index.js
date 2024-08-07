const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database/sequelize');
const cors = require('cors');
const path = require('path');
const passport = require("passport");
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const exphbs = require('express-handlebars');

// 初始化 Redis Client
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

redisClient.connect().catch(console.error);

const app = express();

// 使用 session 和 RedisStore
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));


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





