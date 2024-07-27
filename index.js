const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./database/sequelize')
const cors = require('cors');
const port = process.env.PORT || 3000
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helmet = require('helmet');

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
app.use('/api',userRoutes)
app.use('/api',foodRoutes)

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





