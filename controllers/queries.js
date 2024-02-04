const Pool = require('pg').Pool
const pool = new Pool({
  user: 'yilunwu',
  host: 'localhost',
  database: 'user',
  password: 'password',
  port: 5432,
})


const get_users_info = (request, response) => {
  pool.query('SELECT * FROM user_info ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  });
}


const get_users_info_by_name = (request, response) => {
  const name = request.params.name;

  pool.query('SELECT * FROM user_info WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const post_user_info = (request, response) => {
  const { name, weight, height, year } = request.body

  pool.query('INSERT INTO user_info (name, weight,height ,year) VALUES ($1,$2,$3,$4) RETURNING *', [name, weight, height, year], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
  })
}








module.exports = {
  post_user_info,
  get_users_info,
  get_users_info_by_name,
}