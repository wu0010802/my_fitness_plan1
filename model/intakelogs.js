const sequelize = require('../database/sequelize')
const { DataTypes } = require('sequelize');


const IntakeLogs = sequelize.define('IntakeLogs', {
    intake_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UserInfo,
            key: 'user_id'
        }
    },
    food_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'FoodInfo',
            key: 'food_id'
        }
    },
    intake_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'intakelogs',
    timestamps: false
});






module.exports = IntakeLogs