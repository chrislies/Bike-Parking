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
    site_id:{
      type: DataTypes.STRING,
      allowNull :false,
    },
    ifoaddress:{
      type: DataTypes.STRING,
      allowNull :false,
    },
    racktype:{
      type: DataTypes.STRING,
      allowNull :false,
    },
  },
  {
    timestamps: false, // Set timestamps to false to disable createdAt and updsatedAt columns

  }
);

module.exports = Location;
