const { request, response } = require('express');
const Pool = require('pg').Pool

const pool = new Pool({
    user: 'yilunwu',
    host: 'dpg-cn35ihv109ks73enhtag-a',
    database: 'fitness_a2hw',
    password: 'POI63mtnKUDbDKUmfa4RAiroofRlDNaj',
    port: 5432,
});

const post_intake = async (request, response, next) => {
    const { user_id, food_name, amount } = request.body;
    const now = new Date();
    try {
        const result_id = await pool.query('SELECT food_id FROM food_info WHERE food_name = $1', [food_name]);
        const food_id = result_id.rows[0].food_id;
        pool.query('INSERT INTO intake_logs (user_id,food_id,intake_date,amount) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, food_id, now, amount], (error, result) => {
            if (error) {
                next(error);
            } else {
                response.status(201).send(`User added with intake: ${result.rows[0].food_id}`);
            }
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

const get_daily_intake_nutrition = async (request, response, next) => {
    try {
        const now = new Date();
        const get_daily_intake_nutrition_result = pool.query('SELECT SUM(calories),SUM(protein),SUM(fat),SUM(carbohydrate),SUM(amount) FROM food_info JOIN intake_logs ON food_info.food_id = intake_logs.food_id WHERE intake_date = $1 GROUP BY intake_date;',[now]);
        response.status(200).send(get_daily_intake_nutrition_result.rows[0]);
    } catch(error) {
        console.error(error);
        next(error);
    }
}










module.exports = {
    get_daily_intake_nutrition,
    post_intake
}



