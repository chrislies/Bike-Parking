const { DataTypes } = require("sequelize");
const db = require("../Connect");
const Location = require("./location");
const UserInfo = require("./UserInfo");

const Favorite = db.define(
  "fTest", // Corrected the table name to singular "Favorite"
  {
    // Define columns for location details
    x_coordinate: {
      type: DataTypes.FLOAT, // Adjust precision and scale as per your requirements
      
    },
    y_coordinate: {
      type: DataTypes.FLOAT, // Adjust precision and scale as per your requirements
  
    },
    site_id: {
      type: DataTypes.STRING, // Adjust the length as per your requirements
      
    },
    racktype: {
      type: DataTypes.STRING, // Adjust the length as per your requirements
    
    },
    ifoaddress: {
      type: DataTypes.STRING, // Adjust the length as per your requirements
     
    },

    
  },
  {
    timestamps: false,
    tableName: 'ftest'
  }
);




module.exports = Favorite;
