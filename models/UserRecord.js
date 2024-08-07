const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');


const UserRecord = sequelize.define('UserRecord', {
  info_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    allowNull: false,
  },
  protein: {
    type: DataTypes.NUMERIC(8, 2),
    allowNull: true,
  },
  carbohydrates: {
    type: DataTypes.NUMERIC(8, 2),
    allowNull: true,
  },
  fat: {
    type: DataTypes.NUMERIC(8, 2),
    allowNull: true,
  },
  bmi: {
    type: DataTypes.NUMERIC(8, 2),
    allowNull: true,
  },
  tdee: {
    type: DataTypes.NUMERIC(8, 2),
    allowNull: true,
  },
  exercise_per_week: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'user_record',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date']
    }
  ]
});

module.exports = UserRecord;
