const { request, response } = require('express');
const db_config = require("../config");
// c
const pool = db_config.render_pool;

class Nutrition {
  constructor(tdee) {
    this.tdee = tdee;
  }
  target_protein() {
    const protein = this.tdee * 0.275 / 4;
    return Number(protein.toFixed(2));
  }
  target_fat() {
    const fat = this.tdee * 0.2 / 9;
    return Number(fat.toFixed(2));
  }
  target_carbohydrate() {
    const target_carbohydrate = this.tdee * 0.525 / 4;
    return Number(target_carbohydrate.toFixed(2));
  }
}

function BMR_calculate(gender, weight, height, age) {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - (5 * age) + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - (5 * age) - 161;
  }
  return bmr
}

function TDEE_calculate(exercise_per_week, user_bmr) {
  let tdee;
  if (exercise_per_week === 0) {
    tdee = user_bmr * 1.2;
  } else if (exercise_per_week <= 3) {
    tdee = user_bmr * 1.375;
  } else if (exercise_per_week <= 5) {
    tdee = user_bmr * 1.55;
  } else {
    tdee = user_bmr * 1.725;
  }
  return Number(tdee.toFixed(2));
}

function bmi_calculate(weight, height) {
  const bmi = weight / (height / 100) ** 2;
  return Number(bmi.toFixed(2))
}


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
    response.status(200).json(results.rows[0]);
  });
};

const post_user_info = (request, response, next) => {
  const { name, height, weight, age, gender, exercise_per_week } = request.body;
  const bmr = BMR_calculate(gender, weight, height, age);
  const bmi = bmi_calculate(weight, height);
  const now = new Date();
  const tdee = TDEE_calculate(exercise_per_week, bmr);
  const nutrition = new Nutrition(tdee);
  const target_protein = nutrition.target_protein();
  const target_fat = nutrition.target_fat();
  const target_carbohydrate = nutrition.target_carbohydrate();

  pool.query('INSERT INTO user_info (name, weight, height, age, gender, date,bmi,tdee,protein,fat,carbohydrates) VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11) RETURNING *',
    [name, height, weight, age, gender, now, bmi, tdee, target_protein, target_fat, target_carbohydrate], (error, results) => {
      if (error) {
        next(error);
      } else {
        response.status(201).send(`User added with ID: ${results.rows[0].name}`);
      }
    });
};

const update_user_info = (request, response, next) => {
  const name = request.params.name;
  const { weight, height, age, gender, exercise_per_week } = request.body;
  const bmr = BMR_calculate(gender, weight, height, age);
  const bmi = bmi_calculate(weight, height);
  const tdee = TDEE_calculate(exercise_per_week, bmr);

  pool.query('UPDATE user_info SET weight = $2,gender=$5 ,height = $3, age = $4,bmi =$6,tdee = $7 WHERE name = $1 RETURNING *', [name, weight, height, age, gender, bmi, tdee], (error, results) => {
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