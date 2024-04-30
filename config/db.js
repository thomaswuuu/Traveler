const { Sequelize } = require("sequelize");

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const host = process.env.DATABASE_HOST;
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
