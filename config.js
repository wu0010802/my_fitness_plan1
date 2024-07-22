const { Pool } = require('pg');
require('dotenv').config({ path: '.env.dev' });

const env_pool = new Pool({
    user: process.env.local_postgresql_USER,
    host: process.env.local_postgresql_HOST,
    database: process.env.local_postgresql_DATABASE,
    password: process.env.local_postgresql_PASSWORD,
    port: process.env.local_postgresql_PORT,
});

module.exports = {
    env_pool
};
