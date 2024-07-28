const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const UserInfo = require('./UserInfo');
const FoodInfo = require('./FoodInfo');

const IntakeLogs = sequelize.define('IntakeLogs', {
    log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserInfo,
            key: 'user_id'
        }
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: FoodInfo,
            key: 'food_id'
        }
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'intakelogs',
    timestamps: false
});



module.exports = IntakeLogs;


