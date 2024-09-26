const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const UserInfo = sequelize.define('UserInfo', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
}, {
  timestamps: false,
  tableName: 'user_info'
});

module.exports = UserInfo;


