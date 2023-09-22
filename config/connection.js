const Sequelize = require('sequelize');
// import the 'dotevn. package to read and set inviroment variables 
require('dotenv').config();

// create instance of Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
);

module.exports = sequelize;
