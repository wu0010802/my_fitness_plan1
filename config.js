const Pool = require('pg').Pool



const render_pool = new Pool({
    user: 'yilunwu',
    host: 'dpg-cn35ihv109ks73enhtag-a',
    database: 'fitness_a2hw',
    password: 'POI63mtnKUDbDKUmfa4RAiroofRlDNaj',
    port: 5432,
});


const local_pool = new Pool({
    user: 'yilunwu',
    host: 'localhost',
    database: 'fitness',
    password: 'password',
    port: 5432,
});





module.exports = {
    // get_daily_intake_nutrition,
    render_pool,
    local_pool
}