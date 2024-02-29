const express = require("express");
const router = express.Router();
const Location = require("../Database/Model/location");

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const locations = await Location.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const coordinates = locations.map((location) => {
      return {
        x_coordinate: location.x_coordinate,
        y_coordinate: location.y_coordinate,
       
      };
    });

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
