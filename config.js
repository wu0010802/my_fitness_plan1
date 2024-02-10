const Pool = require('pg').Pool

const env_pool = new Pool({
    user: process.env.VUE_APP_USER,
    host: process.env.VUE_APP_HOST,
    database: process.env.VUE_APP_DATABASE,
    password: process.env.VUE_APP_PASSWORD,
    port: process.env.VUE_APP_PORT,
});

module.exports = {
    env_pool
}