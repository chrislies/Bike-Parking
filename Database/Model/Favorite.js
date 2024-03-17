const { DataTypes } = require("sequelize");
const db = require("../Connect");
const location = require("./location");
const UserInfo = require("./UserInfo");

const Favorite = db.define(
  "Favorites", 
  {
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: location, 
            key: 'id',
        }
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: UserInfo,
            key: 'id',
        }
    },
  },
  {
    timestamps: false,
    tableName: 'favorites'
  }
);

module.exports = Favorite;