require('dotenv').config({ path: '.env.dev' });
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(process.env.Database,
    process.env.Username,
    process.env.Password,
    {
      host: process.env.Hostname,
      port: process.env.Port,
      dialect: process.env.sqltype,
      
    })
  : new Sequelize(
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



