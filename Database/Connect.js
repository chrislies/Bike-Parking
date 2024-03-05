const { Sequelize } = require("sequelize");

const config = require("./database.json");

const env = process.env.NODE_ENV || "development";
const { username, password, database, host, dialect } =
  config[env] || config["development"];

module.exports = new Sequelize(database, username, password, {
  host,
  dialect,
});
