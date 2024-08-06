const { request, response } = require('express');
const UserRecord = require('../models/UserRecord');
const UserInfo = require('../models/UserInfo');
const IntakeLogs = require('../models/IntakeLogs');
const FoodInfo = require('../models/FoodInfo');
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




UserInfo.hasMany(UserRecord, { foreignKey: 'user_id' })
UserRecord.belongsTo(UserInfo, { foreignKey: 'user_id' })



const formatuser = (user_records) => {

  return user_records.map(record => {
    const record_obj = {}
    record_obj.date = record.date
    for (const key in record.dataValues) {
      record_obj[key] = record.dataValues[key]
    }
    return record_obj
  })



}




const get_user_records = async (request, response) => {
  const user_id = request.user.user_id;

  try {
    const userRecords = await UserRecord.findAll({ where: { user_id: user_id } });

    if (userRecords && userRecords.length > 0) {

      response.render('userRecords', { userRecords: formatuser(userRecords) });
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user records:', error);
    response.status(500).json({ error: 'Failed to fetch user records' });
  }
};



async function createUser(request) {
  const { height, weight, age, gender, exercise_per_week } = request.body;
  const bmr = BMR_calculate(gender, weight, height, age);
  const bmi = bmi_calculate(weight, height);
  const now = new Date();
  const tdee = TDEE_calculate(exercise_per_week, bmr);
  const nutrition = new Nutrition(tdee);
  const target_protein = nutrition.target_protein();
  const target_fat = nutrition.target_fat();
  const target_carbohydrate = nutrition.target_carbohydrate();
  const user_id = request.user?.user_id || request.params.user_id;


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
      tdee,
      exercise_per_week
    })
  } catch (error) {
    throw error
  }
}


const post_user_record = async (request, response) => {
  try {
    const record = await createUser(request)
    return record

  } catch (error) {
    console.error('Error creating new user record:', error);
    response.status(500).json({ error: 'Failed to create new user record' });
  }

}


const update_user_record = async (request, response) => {
  const info_id = request.params.info_id;
  const { height,age,gender,weight,exercise_per_week } = request.body
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
        info_id:info_id
      }
    });
    await record.update({
      height:height,
      weight:weight,
      age:age,
      gender:gender,
      protein: target_protein,
      carbohydrates: target_carbohydrate,
      fat: target_fat,
      bmi:bmi,
      tdee:tdee,
      exercise_per_week:exercise_per_week
    })
    await record.save()

    response.status(200).json({ message: 'UserRecord update successfully' });

  } catch (error) {
    console.error('Error updating user record:', error);
    return response.status(500).json({ error: 'Failed to update user record' });
  }
};


const delete_user_record = async (request, response) => {
  const user_id = request.user.user_id
  const info_id = request.params.info_id;
  try {
    const user_records = await UserRecord.findAll({ where: { user_id: user_id } })
    if (user_records.length > 1) {
      const delete_info_id = await UserRecord.destroy({ where: { info_id: info_id } });
      if (delete_info_id) {
        response.status(200).json({ message: "User record has been deleted" });
      } else {
        throw new Error("Failed to delete user record");
      }
    } else {
      return response.status(404).json({ message: "Cant delete to nothing" });
    }



  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};






module.exports = {
  get_user_records,
  post_user_record,
  update_user_record,
  delete_user_record,
  createUser
}











