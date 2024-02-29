const { Sequelize } = require("sequelize");

const config = require("./database.json");

const { name, username, password, host, dialect } =
  config[process.env.NODE_ENV || "development"];

module.exports = new Sequelize(name, username, password, {
  host,
  dialect,
});
