const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userdb = require('./controllers/userqueries');
const fooddb = require('./controllers/foodqueries');
const nutrition = require('./controllers/intake')
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get('/users', userdb.get_users_info);
app.get('/users/:name', userdb.get_users_info_by_name);
app.put('/users/:name', userdb.update_user_info);
app.post('/users', userdb.post_user_info);
app.delete('/users/:name', userdb.deleteUser);
app.get('/food_info/:food', fooddb.get_food_info);
app.post('/intake',nutrition.post_intake)


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



