// const { request, response } = require('express');
// const Pool = require('pg').Pool


// const pool = new Pool({
//     user: 'yilunwu',
//     host: 'localhost',
//     database: 'fitness',
//     password: 'password',
//     port: 5432,
// })

// // 加入食物至intakelogs(user_id,food_id,intake_date,amount)

// const post_intake = async (request, response, next) => {
//     const food_name = request.params.food;
//     try {
//         const get_food_id = await pool.query('SELECT food_id FROM food_info WHERE food_name=$1'), [food_name],(error,results)=>{
//             if(error){
//                 next(error);
//             }else{
//                 return results.rows[0];
//             }
//         }
//     }
//     catch (error) {
//         console.error(error);
//     }
// }


