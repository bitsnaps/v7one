// require('dotenv').config({ path: '../../.env' }); // Adjust path as needed if .env is not in project root relative to this file's execution
require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './7vdb.sqlite', // Relative to the 'api' directory
    logging: false,
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