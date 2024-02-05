const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./controllers/queries');
const port = 3000;

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

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})