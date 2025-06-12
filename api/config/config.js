const path = require('path');

// Load .env for development and .env.production for production
require('dotenv').config({ path: process.env.NODE_ENV=='production'?'.env.prod' :'.env' });

// require('dotenv').config({ path: '.env' });


module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This might be needed for some cloud providers like Heroku
      },
    },
    logging: false,
  },
};