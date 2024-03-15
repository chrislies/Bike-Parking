const { DataTypes } = require("sequelize");
const db = require("../Connect");

const UserInfo = db.define('User', {

    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},

    {
        timestamps: false,
        tableName: '"User"'
    }
);

module.exports = UserInfo;