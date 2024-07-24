const { request, response } = require('express');
const UserRecord = require('../model/UserRecord');
const UserInfo = require('../model/Userinfo');
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




module.exports = {

}