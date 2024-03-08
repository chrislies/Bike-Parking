const { DataTypes } = require("sequelize");
const db = require("../Connect");

const UserInfo = db.define('userinfo', {

    User_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},

    {
        timestamps: false
    }
);

module.exports = UserInfo;