const { request, response } = require('express');
const Pool = require('pg').Pool


const pool = new Pool({
    user: 'yilunwu',
    host: 'localhost',
    database: 'fitness',
    password: 'password',
    port: 5432,
})

// 加入食物至intakelogs(user_id,food_id,intake_date,amount)
const post_intake = async (request, response, next) => {
    const {user_id,food_name,amount}= request.body;
    // const food_name = request.params.food;
    // const user_id = request.params.user_id;//默認1
    // const amount = request.params.amount;
    const now = new Date();
    try {
        const result_id = await pool.query('SELECT food_id FROM food_info WHERE food_name = $1', [food_name]);
        const food_id = result_id.rows[0].food_id;
        pool.query('INSERT INTO intakelogs (user_id,food_id,intake_date,amount) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, food_id, now, amount], (error, result) => {
           if(error){
            next(error);
           }else{
            response.status(201).send(`User added with intake: ${result.rows[0].food_id}`);
           }
        });

    }
    catch (error) {
        console.error(error);
        // 調用 next 函數傳遞錯誤到 Express 的錯誤處理中間件
        next(error);
    }
}














// const daily_target_calculate = async(request,response,next) =>{

// }











module.exports ={
    post_intake
}