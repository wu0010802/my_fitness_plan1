const sequelize = require('../database/sequelize')
const { DataTypes } = require('sequelize');



const UserRecord = sequelize.define('UserRecord', {
  info_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: UserInfo,
      key: 'user_id'
    }
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
  tableName: 'user_record',
});



module.exports = UserRecord;

