const { DataTypes } = require("sequelize");
const db = require("../Connect");

const Admin = db.define('admin', {

    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},

    {
        timestamps: false,
        tableName: '"admin"'
    }
);

module.exports = Admin;