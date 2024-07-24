const sequelize = require('../database/sequelize')
const { DataTypes } = require('sequelize');



const UserInfo = sequelize.define('UserInfo', {
    info_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    height: {
      type: DataTypes.NUMERIC(5, 2),
      allowNull: true,
    },
    weight: {
      type: DataTypes.NUMERIC(5, 2),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    protein: {
      type: DataTypes.NUMERIC(6, 2),
      allowNull: true,
    },
    carbohydrates: {
      type: DataTypes.NUMERIC(6, 2),
      allowNull: true,
    },
    fat: {
      type: DataTypes.NUMERIC(6, 2),
      allowNull: true,
    },
    bmi: {
      type: DataTypes.NUMERIC(6, 2),
      allowNull: true,
    },
    tdee: {
      type: DataTypes.NUMERIC(6, 2),
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'user_info',
  });
  
  module.exports = UserInfo;

