require('dotenv').config();

const { Sequelize } = require('sequelize');
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.local_postgresql_DATABASE,
      process.env.local_postgresql_USER,
      process.env.local_postgresql_PASSWORD,
      {
        host: process.env.local_postgresql_HOST,
        dialect: process.env.local_sql_type,
        port: process.env.local_postgresql_PORT
      }
    );

module.exports = sequelize;



