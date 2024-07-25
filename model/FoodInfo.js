const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const FoodInfo = sequelize.define('FoodInfo', {
  food_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  food_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  protein: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  fat: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  carbohydrate: {
    type: DataTypes.REAL,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'food_info'
});

module.exports = FoodInfo;
