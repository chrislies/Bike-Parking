const { DataTypes } = require("sequelize");
const db = require("../Connect");

const Request = db.define(
  "Requests", 
  {
    request_type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  {
    timestamps: false, // Set timestamps to false to disable createdAt and updatedAt columns

  }
);

module.exports = Request;