const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const IntakeLogs = sequelize.define('IntakeLogs', {
  log_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'intakelogs'
});

module.exports = IntakeLogs;
