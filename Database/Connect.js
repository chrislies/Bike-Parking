const {Sequelize} = require("sequelize")

const config = require("./database.json")

const {username,password,host,dialect}=config[process.env.NODE_ENV || "development"];

module.exports = new Sequelize (username,password,{
    host,
    dialect,  
});