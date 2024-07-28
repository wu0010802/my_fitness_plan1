const { request, response } = require('express');
const UserRecord = require('../models/UserRecord');
const UserInfo = require('../models/UserInfo');
const IntakeLogs = require('../models/IntakeLogs');
const FoodInfo = require('../models/FoodInfo');
const sequelize = require('../database/sequelize');
const { Op } = require('sequelize');

UserInfo.belongsToMany(FoodInfo, { through: IntakeLogs, foreignKey: 'user_id' });
FoodInfo.belongsToMany(UserInfo, { through: IntakeLogs, foreignKey: 'food_id' });
IntakeLogs.belongsTo(UserInfo, { foreignKey: 'user_id' });
IntakeLogs.belongsTo(FoodInfo, { foreignKey: 'food_id' });

const get_user_intakelogs_by_user_date = async (request, response) => {
    const user_id = request.query.user_id;
    const date = new Date(request.query.date);
    try {
        const intakeLogs = await IntakeLogs.findAll({
            where: {
                user_id: user_id,
                date: date
            },
            include: [
                {
                    model: FoodInfo
                },
                {
                    model: UserInfo,
                    where: {
                        user_id: user_id
                    }
                }
            ]
        });

        response.status(200).json(intakeLogs);
    } catch (error) {
        console.error('Error fetching intake logs:', error);
        response.status(500).json({ error: 'Failed to fetch intake logs' });
    }
};




module.exports = {
    get_user_intakelogs_by_user_date
}

