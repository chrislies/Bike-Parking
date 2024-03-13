const { DataTypes } = require("sequelize");
const db = require("../Connect");

const Favorite = db.define(
  "Favorites", 
  {
    Location: {
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:location,
            key:'id',
        }
    },

    User: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:UserInfo,
            key: 'id',
        }
    },
  },
  {
    timestamps: false, // Set timestamps to false to disable createdAt and updatedAt columns

  }
);

module.exports = Favorite;