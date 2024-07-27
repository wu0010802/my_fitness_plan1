const { request, response } = require('express');
const FoodInfo = require('../model/FoodInfo');
const app_id = 'cae8d934';
const app_key = 'c976bc0181f55b17746ee0f242d811d2';

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
            response.status(200).json(created_food);
        } else {

            response.status(200).json(food_db);
        }
    } catch (error) {
        console.error('Error fetching food info:', error);
        response.status(500).json({ error: 'Failed to fetch food info' });
    }
};


// const get_food_info = async (request, response) => {
//     const food_name = request.query.food;

//     try {
//         let food_db = await FoodInfo.findOne({
//             where: {
//                 food_name: food_name
//             }
//         });

//         if (!food_db) {
//             const food_edamam = await getFoodInfo_api(food_name);
//             if (food_edamam.parsed && food_edamam.parsed.length > 0) {
//                 const nutrients = food_edamam.parsed[0].food.nutrients;
//                 const { PROCNT: protein, FAT: fat, CHOCDF: carbohydrate, ENERC_KCAL: calories } = nutrients;
//                 await FoodInfo.create({
//                     food_name: food_name,
//                     calories: calories,
//                     protein: protein,
//                     carbohydrate: carbohydrate,
//                     fat: fat
//                 });
//                 response.status(200).json({ food_name, calories, protein, carbohydrate, fat });
//             } else {
//                 response.status(404).json({ error: 'No nutritional information found for the given food.' });
//             }
//         } else {
//             response.status(200).json(food_db);
//         }
//     } catch (error) {
//         console.error('Error fetching food info:', error);
//         response.status(500).json({ error: 'Failed to fetch food info' });
//     }
// };

module.exports = {
    get_post_food_info
};









