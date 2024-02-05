const { request, response } = require('express');
const now = new Date();

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

const post_user_info = (request, response, next) => {
  const { name, height, weight, year, gender } = request.body;
  const bmi = weight / (height / 100) ** 2; // 將身高從厘米轉換為米
  const now = new Date(); // 獲取當前時間

  pool.query('INSERT INTO user_info (name, weight, height, year, gender, date,bmi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [name, height, weight, year, gender, now, bmi], (error, results) => {
      if (error) {
        next(error); // 使用 next 將錯誤傳遞給錯誤處理中間件
      } else {
        response.status(201).send(`User added with ID: ${results.rows[0].user_id}`);
      }
    });
};


const update_user_info = (request, response, next) => {
  const name = request.params.name;
  const { weight, height, year, gender } = request.body;
  const bmi = weight / (height / 100) ** 2;
  const now = new Date();
  pool.query('UPDATE user_info SET weight = $2,gender=$6 ,height = $3, year = $4,bmi = $5 WHERE name = $1 RETURNING *', [name, weight, height, year, bmi, gender], (error, results) => {
    if (error) {
      next(error);
    }
    if (results.rows.length > 0) {

      response.status(200).json(results.rows[0]);
    } else {

      response.status(404).send(`User not found with name: ${name}`);
    }
  });
}
const deleteUser = (request, response) => {
  const name = request.params.name;

  pool.query('DELETE FROM user_info WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${name}`)
  })
}



module.exports = {
  post_user_info,
  get_users_info,
  get_users_info_by_name,
  update_user_info,
  deleteUser,
}