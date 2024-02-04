const Pool = require('pg').Pool
const pool = new Pool({
    user: 'yilunwu',
    host: 'localhost',
    database: 'user',
    password: 'password',
    port: 5432,
  })


const post_user_info = (request,response)=>{
    const {name, weight,height ,year} = request.body

    pool.query('INSERT INTO user_info (name, weight,height ,year) VALUES ($1,$2,$3,$4) RETURNING *' , [name, weight,height ,year], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
      })
}








module.exports = {
    post_user_info,
  }