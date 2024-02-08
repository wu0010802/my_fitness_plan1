const { request, response } = require('express');
const app_id = 'cae8d934';
const app_key = 'c976bc0181f55b17746ee0f242d811d2';
const Pool = require('pg').Pool


const pool = new Pool({
    user: 'yilunwu',
    host: 'localhost',
    database: 'fitness',
    password: 'password',
    port: 5432,
})

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

const get_food_info = async (request, response, next) => {
    const food_name = request.params.food;

    try {
        const results = await pool.query('SELECT * FROM food_info WHERE food_name = $1', [food_name]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            const food_result = await getFoodInfo_api(food_name);
            const {
                ENERC_KCAL: calories,
                PROCNT: protein,
                FAT: fat,
                CHOCDF: carbohydrate
            } = food_result.parsed[0].food.nutrients;
            pool.query('INSERT INTO food_info (food_name, calories, protein, fat, carbohydrate) VALUES ($1, $2, $3, $4, $5) RETURNING *', [food_name, calories, protein, fat, carbohydrate], (error, results) => {
                if (error) {

                    console.log("insert error");
                }
            });
            response.status(200).json(food_result.parsed[0].food.nutrients);

        }

    } catch (error) {
        next(error);
    }


};

module.exports = {
    getFoodInfo_api,
    get_food_info
}

