const { request, response } = require('express');

const UserInfo = require('../models/UserInfo');
const FoodInfo = require('../models/FoodInfo');
const IntakeLogs = require('../models/intakelogs');
const { Query } = require('pg');
const QueryFrequency = require('../models/QueryFrequency');


const now = new Date()
const formattedDate = now.toISOString().split('T')[0];



FoodInfo.hasOne(QueryFrequency, {
    foreignKey: 'food_id',
    onDelete: 'CASCADE',
});

QueryFrequency.belongsTo(FoodInfo, {
    foreignKey: 'food_id',
});


UserInfo.belongsToMany(FoodInfo, { through: IntakeLogs, foreignKey: 'user_id' });
FoodInfo.belongsToMany(UserInfo, { through: IntakeLogs, foreignKey: 'food_id' });
IntakeLogs.belongsTo(UserInfo, { foreignKey: 'user_id' });
IntakeLogs.belongsTo(FoodInfo, { foreignKey: 'food_id' });

const unit_transform = (nutrition, amount) => {
    return (nutrition * amount / 100).toFixed(2);
}

const intakelogs_helper = async (user_id, date) => {
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
        return intakeLogs
    } catch (error) {
        console.error('Error fetching intake logs:', error);
        throw new Error('Failed to fetch intake logs');
    }

}

const formatedlog = async (user_id, date) => {
    const intakeLogs = await intakelogs_helper(user_id, date)
    const formattedLogs = intakeLogs.map(log => ({
        amount: log.amount,
        date: formattedDate,
        FoodInfo: {
            food_name: log.FoodInfo.food_name,
            calories: unit_transform(log.FoodInfo.calories, log.amount),
            protein: unit_transform(log.FoodInfo.protein, log.amount),
            fat: unit_transform(log.FoodInfo.fat, log.amount),
            carbohydrate: unit_transform(log.FoodInfo.carbohydrate, log.amount)
        },
        UserInfo: {
            username: log.UserInfo.username
        },
        log_id: log.log_id
    }));
    return formattedLogs.reverse()
}

const sum_nutrition = (intakelogs) => {
    const sum_logs = {
        total_calories: intakelogs.reduce((total, log) => {
            return (total + Number(log.FoodInfo.calories));
        }, 0).toFixed(2),
        total_protein: intakelogs.reduce((total, log) => {
            return total + Number(log.FoodInfo.protein);
        }, 0).toFixed(2),
        total_fat: intakelogs.reduce((total, log) => {
            return total + Number(log.FoodInfo.fat);
        }, 0).toFixed(2),
        total_carbohydrate: intakelogs.reduce((total, log) => {
            return total + Number(log.FoodInfo.carbohydrate);
        }, 0).toFixed(2)
    }
    return sum_logs
}




const totalCalories_helper = async (user_id, date) => {
    const intakeLogs = await intakelogs_helper(user_id, date)
    const totalCalories = intakeLogs.reduce((total, log) => {
        return total + (log.amount / 100 * log.FoodInfo.calories);
    }, 0);
    return totalCalories
}


const get_user_intakelogs = async (request, response) => {
    const user_id = request.user.user_id;

    try {
        const reverse_formattedLogs = await formatedlog(user_id, formattedDate);
        const sum_log = sum_nutrition(reverse_formattedLogs);

        response.render('intakelogs', { logs: reverse_formattedLogs, sum_log: sum_log });
    } catch (error) {
        console.error('Error fetching intake logs:', error);
        response.status(500).json({ error: 'Failed to fetch intake logs' });
    }
}

const total_calories = async (request, response) => {
    const user_id = request.user.user_id;


    try {
        const total_calories = await totalCalories_helper(user_id, formattedDate);
        return total_calories
    } catch (error) {
        console.error('Error fetching total calories:', error);
        response.status(500).json({ error: 'Failed to fetch total calories' });
    }
}

const post_user_intakelogs = async (request, response) => {
    const user_id = request.user.user_id;
    const { food_name, amount } = request.body;
    try {
        const food = await FoodInfo.findOne({ where: { food_name: food_name } });
        if (!food) {
            return response.status(404).json({ error: 'Food not found' });
        }


        const new_intake = await IntakeLogs.create({
            user_id: user_id,
            date: formattedDate,
            amount: amount,
            food_id: food.food_id
        });
        const queryFrequency = await QueryFrequency.findByPk(food.food_id);
        if (queryFrequency) {
            await queryFrequency.increment('query_frequency');
        } else {
            await QueryFrequency.create({ food_id: food.food_id, query_frequency: 1 });
        }


        response.redirect('/profile');
    } catch (error) {
        console.error('Error creating new intake log:', error);
        response.status(500).json({ error: 'Failed to create new intake log' });
    }
}


const delete_user_intakelog = async (request, response) => {
    const logId = request.params.log_id;
    try {

        await IntakeLogs.destroy({ where: { log_id: logId } });
        response.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        response.status(500).json({ error: 'Failed to delete record' });
    }


}

const update_user_intakelog = async (request, response) => {
    const log_id = request.params.log_id;
    const { amount } = request.body
    try {
        const log = await IntakeLogs.findOne({
            where: {
                log_id: log_id
            }
        });
        const updated_log = await log.update({
            amount: amount
        })
        await updated_log.save()
        response.status(200).json({ message: 'Record update successfully' });
    } catch (error) {
        console.error('Error update record:', error);
        response.status(500).json({ error: 'Failed to update record' });
    }


}


module.exports = {
    get_user_intakelogs,
    post_user_intakelogs,
    total_calories,
    delete_user_intakelog,
    update_user_intakelog
}




