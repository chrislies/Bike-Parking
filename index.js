const db = require("./Database/Connect");
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require('axios');
const { Op } = require("sequelize");

const Location = require('./Database/Model/location');
const UserInfo = require('./Database/Model/UserInfo');
const Admin = require('./Database/Model/Admin');
const Favorite = require('./Database/Model/Favorite');
const Pedning = require('./Database/Model/Pending');
const Request = require('./Database/Model/Request');

const LIMIT = 40000;

async function fetchAPI() {
  try {
    const response = await axios.get(`https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=${LIMIT}`);
    const apiData = response.data;

  
    const locationsData = apiData.map(location => ({
      x_coordinate: parseFloat(location.x),
      y_coordinate: parseFloat(location.y),
      site_id: location.site_id,  
      ifoaddress: location.ifoaddress,  
    }));

    const existingRecords = await Location.findAll();
    
    // Filter out duplicates based on site_id
    const uniqueLocations = locationsData.filter(newLocation => {
      return !existingRecords.some(existing => existing.site_id === newLocation.site_id);
    });

    // Bulk insert unique locations
    await Location.bulkCreate(uniqueLocations);

    

    console.log('Data populated successfully.');
  } catch (error) {
    console.error('Error populating data:', error.message);
  }
}


fetchAPI();



const PORT = 3001;

app.use(express.json());
app.use(cors());
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Include any other methods you need
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include any other headers you need

app.use("/Parking_data", require("./Route/location"));
app.use("/info", require("./Route/UserInfo"));
app.use("/admin", require("./Route/Admin"));
app.use("/pending", require("./Route/Pending"));
app.use("/favorite", require("./Route/Favorite"));
app.use("/request", require("./Route/Request"));

db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
