const db = require("./Database/Connect");
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require('axios');


const Location = require('./Database/Model/location');

const LIMIT = 40000; 
async function fetchAPI() {
  try {
    const response = await axios.get(`https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=${LIMIT}`);
    const apiData = response.data;

    for (const location of apiData) {
      // Check if the record already exists in the database
      const existedData = await Location.findOne({
        where: {
          x_coordinate: location.x,
          y_coordinate: location.y,
        },
      });

      if (!existedData) {
        await Location.create({
          x_coordinate: location.x,
          y_coordinate: location.y,
        });
      }
    }

    //console.log('Data populated successfully.');
  } catch (error) {
    console.error('Error populating data:', error.message);
  }
}

fetchAPI();

const PORT = 3001;

app.use(express.json());
app.use(cors());


app.use("/", require("./Route/location"));

db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Unable to connect to the database:", err));