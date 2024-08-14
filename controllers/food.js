const { request, response } = require('express');
const FoodInfo = require('../models/FoodInfo');
const QueryFrequency = require('../models/QueryFrequency');


FoodInfo.hasOne(QueryFrequency, {
    foreignKey: 'food_id',
    onDelete: 'CASCADE',
});

QueryFrequency.belongsTo(FoodInfo, {
    foreignKey: 'food_id',
});

require('dotenv').config({ path: '.env.dev' });
const app_id = process.env.api_id;
const app_key = process.env.api_key;

const unit_transform = (nutrition, amount) => {
    return (nutrition * amount / 100).toFixed(2);
}

async function getFoodInfo_api(food) {
    try {
        const response = await fetch(
            `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}&ingr=${(food)}&nutrition-type=cooking`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('api fail', error);
    }
}

const get_post_food_info = async (request, response) => {

    const food_name = request.query.food;
    const amount = request.query.amount;
    const attributesToTransform = ['calories', 'carbohydrate', 'fat', 'protein'];
    try {

        let food_db = await FoodInfo.findOne({
            where: {
                food_name: food_name
            }
        });

        if (!food_db) {
            const food_edamam = await getFoodInfo_api(food_name);
            const nutrients = food_edamam.parsed[0].food.nutrients;
            const { PROCNT: protein, FAT: fat, CHOCDF: carbohydrate, ENERC_KCAL: calories } = nutrients;


            const created_food = await FoodInfo.create({ food_name: food_name, calories: calories, protein: protein, carbohydrate: carbohydrate, fat: fat });


            attributesToTransform.forEach(attribute => {
                created_food[attribute] = unit_transform(created_food[attribute], amount);
            });

            response.status(200).json(created_food);
        } else {
            attributesToTransform.forEach(attribute => {
                food_db[attribute] = unit_transform(food_db[attribute], amount);
            });
            response.status(200).json(food_db);
        }
    } catch (error) {
        console.error('Error fetching food info:', error);
        response.status(500).json({ error: 'Failed to fetch food info' });
    }
};




const get_most_frequent_query_food = async (request, response) => {
    try {
        const top_query_foods = await QueryFrequency.findAll({
            order: [
                ['query_frequency', 'DESC'],

            ],
            limit: 5,
            include: {
                model: FoodInfo
            }
        })
        const formated_top_query_food = top_query_foods.map(food => ({
            food_name: food.FoodInfo.food_name,
            calories: food.FoodInfo.calories,
            protein: food.FoodInfo.protein,
            fat: food.FoodInfo.fat,
            carbohydrate: food.FoodInfo.carbohydrate
        }))
        response.json(formated_top_query_food)
    } catch (error) {
        console.error('fail to get food frequency:', error)
        response.status(500).json({ error: 'fail to get food frequency' });
    }
}

module.exports = {
    get_post_food_info,
    get_most_frequent_query_food
};









