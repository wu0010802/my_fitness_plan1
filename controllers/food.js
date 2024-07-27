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
        console.error(error);
    }
}





// const get_food_info = async (request, response) => {
//     const query_food = req.params.food;

//     try {
//         const food_db = await FoodInfo.findAll()
//         console.log(food_db)
//         response.status(200).json(food_db)

//     } catch (error) {

//     }

// }











module.exports = {
    get_food_info

}





