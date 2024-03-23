const express = require("express");
const router = express.Router();
const Location = require("../Database/Model/location");
const cors = require("cors"); // Import the CORS middleware


router.get("/", async (req, res) => {
  try {
    const locations = await Location.findAll();
    
    // Check if X and Y parameters are provided
    const X = parseFloat(req.query.X);
    const Y = parseFloat(req.query.Y);

    if (isNaN(X) || isNaN(Y)) {
      // If parameters are not provided, return all locations
      return res.json(locations);
    }

    // Filter locations based on the condition
    const filteredLocations = locations.filter(location => {
      const withinXRange = Math.abs(location.x_coordinate - X) <= 0.005;
      const withinYRange = Math.abs(location.y_coordinate - Y) <= 0.005;
      return withinXRange && withinYRange;
    });

    // Map the filtered locations to required format
    const coordinates = filteredLocations.map(location => ({
      x_coordinate: location.x_coordinate,
      y_coordinate: location.y_coordinate,
      site_id: location.site_id,  
      ifoaddress: location.ifoaddress,
      racktype: location.racktype,
    }));

    // Send the coordinates as a JSON response
    return res.json(coordinates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/",async(req,res)=>{
  let newlocation=await Location.create(req.body);
  res.status(200).json(newlocation);

});

router.delete("/:id", async (req, res) => {
  await Location.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("Location deleted");
});


router.delete("/", async (req, res) => {
  await Location.destroy({
    where: {
      x_coordinate: req.parms.x_coordinate,
      y_coordinate: req.params.y_coordinate,
    },
  });
  res.status(200).json("Location deleted");
});



module.exports = router;
