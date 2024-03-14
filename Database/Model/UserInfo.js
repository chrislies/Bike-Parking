const { DataTypes } = require("sequelize");
const db = require("../Connect");

const UserInfo = db.define('userinfo', {

    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},

    {
        timestamps: false,
        tableName: 'userinfo'
    }
);

module.exports = UserInfo;