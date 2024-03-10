const db = require("./Database/Connect");
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require('axios');
const { Op } = require("sequelize");

const Location = require('./Database/Model/location');
const UserInfo = require('./Database/Model/UserInfo');

const LIMIT = 40000;

async function fetchAPI() {
  try {
    const response = await axios.get(`https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=${LIMIT}`);
    const apiData = response.data;

    const coordinates = apiData.map(location => ({
      x_coordinate: parseFloat(location.x),  // Convert to number
      y_coordinate: parseFloat(location.y),  // Convert to number
    }));

    const existingRecords = await Location.findAll();
    // Filter out duplicate coordinates
    const uniqueCoordinates = coordinates.filter(coord => {
      const isDuplicate = existingRecords.some(record =>
        record.x_coordinate === coord.x_coordinate &&
        record.y_coordinate === coord.y_coordinate
      );
      return !isDuplicate;
    });

    // Bulk insert unique coordinates
    await Location.bulkCreate(uniqueCoordinates);

    console.log('Data populated successfully.');
  } catch (error) {
    console.error('Error populating data:', error.message);
  }
}

fetchAPI();

const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use("/", require("./Route/location"));
app.use("/info", require("./Route/UserInfo"));

db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
