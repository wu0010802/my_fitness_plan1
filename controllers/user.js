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


UserInfo.hasMany(UserRecord, { foreignKey: 'user_id' })
UserRecord.belongsTo(UserInfo, { foreignKey: 'user_id' })


const get_user_records = async (request, response) => {
  const user_id = request.params.id;
  try {
    const userRecords = await UserInfo.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: UserRecord
        }
      ]
    });

    if (userRecords) {
      response.json(userRecords);
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user records:', error);
    response.status(500).json({ error: 'Failed to fetch user records' });
  }
};

// const post_user_record = async (request,response)=>{
//   const {height,weight,age,gender} = req.body;
//   const date = Date.now
//   const tdee = 





//   try{
//     const new_record = UserRecord.create
//   }catch(error){

//   }
// }






module.exports = {
  get_user_records
}