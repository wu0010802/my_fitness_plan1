const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const FoodInfo = require('./FoodInfo');

const QueryFrequency = sequelize.define('QueryFrequency', {
  food_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    references:{
        model: FoodInfo,
        key: 'food_id'
    }
  },
  query_frequency:{
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  tableName: 'query_frequency'
});

module.exports = QueryFrequency;
