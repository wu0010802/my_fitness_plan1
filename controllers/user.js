const { request, response } = require('express');
const UserRecord = require('../model/UserRecord');
const UserInfo = require('../model/UserInfo');
const IntakeLogs = require('../model/IntakeLogs');
const FoodInfo = require('../model/FoodInfo');
const sequelize = require('../database/sequelize');
const { Op } = require('sequelize');


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

async function createUser(data) {
  const { height, weight, age, gender, exercise_per_week } = data.body;
  const bmr = BMR_calculate(gender, weight, height, age);
  const bmi = bmi_calculate(weight, height);
  const now = new Date();
  const tdee = TDEE_calculate(exercise_per_week, bmr);
  const nutrition = new Nutrition(tdee);
  const target_protein = nutrition.target_protein();
  const target_fat = nutrition.target_fat();
  const target_carbohydrate = nutrition.target_carbohydrate();
  const user_id = data.params.id;

  try {
    return await UserRecord.create({
      user_id,
      height,
      weight,
      age,
      gender,
      date: now,
      protein: target_protein,
      carbohydrates: target_carbohydrate,
      fat: target_fat,
      bmi,
      tdee
    })
  } catch (e) {
    throw e
  }
}


UserInfo.hasMany(UserRecord, { foreignKey: 'user_id' })
UserRecord.belongsTo(UserInfo, { foreignKey: 'user_id' })


const get_user_records = async (request, response) => {
  const user_id = request.query.user_id;
  let filter = {}; 

  if (user_id) {
    filter = {
      where: { user_id: user_id },
      include: [{ model: UserRecord }]
    };
  } else {
    filter = {
      include: [{ model: UserRecord }]
    };
  }

  try {
    const userRecords = await UserInfo.findAll(filter);

    if (userRecords && userRecords.length > 0) {
      response.json(userRecords);
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user records:', error);
    response.status(500).json({ error: 'Failed to fetch user records' });
  }
};


const post_user_record = async (request, response) => {

  try {
    const record = await createUser(request)
    return response.status(201).json(record);

  } catch (error) {
    console.error('Error creating new user record:', error);
    response.status(500).json({ error: 'Failed to create new user record' });
  }

}


const update_user_record = async (request, response) => {
  const user_id = request.params.id
  const { height, weight, age, gender, exercise_per_week } = request.body;
  const now = new Date().toISOString().split('T')[0];

  const bmr = BMR_calculate(gender, weight, height, age);
  const bmi = bmi_calculate(weight, height);
  const tdee = TDEE_calculate(exercise_per_week, bmr);
  const nutrition = new Nutrition(tdee);
  const target_protein = nutrition.target_protein();
  const target_fat = nutrition.target_fat();
  const target_carbohydrate = nutrition.target_carbohydrate();

  try {

    const record = await UserRecord.findOne({
      where: {
        user_id: user_id,
        date: now
      }
    });
    await record.update({
      height,
      weight,
      age,
      gender,
      exercise_per_week,
      protein: target_protein,
      carbohydrates: target_carbohydrate,
      fat: target_fat,
      bmi,
      tdee
    })
    await record.save()

    return response.status(200).json({
      data: record,
      code: 201,
      success: true
    });

  } catch (error) {
    console.error('Error updating user record:', error);
    return response.status(500).json({ error: 'Failed to update user record' });
  }
};


const delete_user_record = async (request, response) => {
  const user_id = request.params.id;
  const now = new Date().toISOString().split('T')[0];
  const select_date = request.query.date;

  const filter = {
    where: {
      user_id: user_id,
      date: now
    }
  };

  if (select_date) {
    filter.where.date = select_date;
  }

  try {
    const deleted_user = await UserRecord.destroy(filter);

    if (deleted_user) {
      response.status(200).json({ message: "User record has been deleted" });
    } else {
      throw new Error("Failed to delete user record");
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};






module.exports = {
  get_user_records,
  post_user_record,
  update_user_record,
  delete_user_record
}








