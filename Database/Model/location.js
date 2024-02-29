const { DataTypes } = require("sequelize");
const db = require("../Connect");

const Location = db.define(
  "locations", 
  {
    x_coordinate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    y_coordinate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Set timestamps to false to disable createdAt and updatedAt columns

  }
);

module.exports = Location;
