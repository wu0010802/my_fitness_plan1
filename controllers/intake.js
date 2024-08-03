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

const format_totalCalories_helper = async (user_id, date) => {
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
        const formattedLogs = intakeLogs.map(log => ({
            amount: log.amount,
            date: new Date(log.date).toLocaleDateString(), // 日期格式化
            FoodInfo: {
                food_name: log.FoodInfo.food_name,
                calories: log.FoodInfo.calories,
                protein: log.FoodInfo.protein,
                fat: log.FoodInfo.fat,
                carbohydrate: log.FoodInfo.carbohydrate
            },
            UserInfo: {
                username: log.UserInfo.username
            }

        }));
        const totalCalories = intakeLogs.reduce((total, log) => {
  
            return total + (log.amount / 100 * log.FoodInfo.calories);//精度處理
        }, 0);
  
  
        return { formattedLogs, totalCalories }




    } catch (error) {
        console.error('Error fetching intake logs:', error);
        throw new Error('Failed to fetch intake logs');
    }
};





const get_user_intakelogs = async (request, response) => {
    const user_id = request.user.user_id; 
    const date = new Date();
    try {
        const { formattedLogs } = await format_totalCalories_helper(user_id, date);
        
        response.render('intakelogs', { logs: formattedLogs });
    } catch (error) {
        console.error('Error fetching intake logs:', error);
        response.status(500).json({ error: 'Failed to fetch intake logs' });
    }
}

const total_calories = async (request, response) => {
    const user_id = request.user.user_id;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];



    try {
        const { totalCalories } = await format_totalCalories_helper(user_id, formattedDate);

        return totalCalories
    } catch (error) {
        console.error('Error fetching total calories:', error);
        response.status(500).json({ error: 'Failed to fetch total calories' });
    }
}



const post_user_intakelogs = async (request, response) => {
    const user_id = request.user.user_id; 
    const date = new Date();
    const { food_name, amount } = request.body;

    try {
        
        const food = await FoodInfo.findOne({ where: { food_name: food_name } });

        if (!food) {
            return response.status(404).json({ error: 'Food not found' });
        }

        
        const new_intake = await IntakeLogs.create({
            user_id: user_id,
            date: date,
            amount: amount,
            food_id: food.food_id
        });

        response.status(201).json({ message: "Create new intake success", new_intake });
    } catch (error) {
        console.error('Error creating new intake log:', error);
        response.status(500).json({ error: 'Failed to create new intake log' });
    }
}




module.exports = {
    get_user_intakelogs,
    post_user_intakelogs,
    total_calories
}

