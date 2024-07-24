const sequelize = require('../database/sequelize')
const { Sequelize, DataTypes } = require('sequelize');



const UserInfo = sequelize.define('UserInfo', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    }
}, {
    tableName: 'user_info',
    timestamps: false
});




module.exports = UserInfo;