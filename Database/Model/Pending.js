const { DataTypes } = require("sequelize");
const db = require("../Connect");

const Pending = db.define(
  "pendings", 
  {
    x_coordinate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    y_coordinate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    reuqest_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Request, // Referencing the Request model
            key: 'id' // Assuming the primary key of Request table is 'id'
        }
    },
  },
  {
    timestamps: false, // Set timestamps to false to disable createdAt and updatedAt columns

  }
);

module.exports = Pending;