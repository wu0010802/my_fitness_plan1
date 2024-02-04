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

app.post('/users',db.post_user_info);




app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })