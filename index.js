const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./controllers/queries');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get('/users', db.get_users_info);
app.get('/users/:name', db.get_users_info_by_name);
app.put('/users/:name', db.update_user_info);
app.post('/users', db.post_user_info);
app.delete('/users/:name',db.deleteUser);

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



