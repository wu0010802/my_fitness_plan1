const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.dev' });

const sequelize = new Sequelize(
  process.env.local_postgresql_DATABASE,
  process.env.local_postgresql_USER,
  process.env.local_postgresql_PASSWORD,
  {
    host: process.env.local_postgresql_HOST,
    port: process.env.local_postgresql_PORT,
    dialect: process.env.local_sql_type,
    
  }
);

module.exports = sequelize;



