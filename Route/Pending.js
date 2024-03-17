const express = require("express");
const router = express.Router();
const Pending = require("../Database/Model/Pending");

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const pendings = await Pending.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const coordinates = pendings.map((pending) => {
      return {
        x_coordinate: pending.x_coordinate,
        y_coordinate: pending.y_coordinate,
        request_type: pending.request_type,
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
  let newlocation=await Pending.create(req.body);
  res.status(200).json(newlocation);

});

router.delete("/:id", async (req, res) => {
  await Pending.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("Pending Location deleted");
});


router.delete("/", async (req, res) => {
  await Pending.destroy({
    where: {
      x_coordinate: req.parms.x_coordinate,
      y_coordinate: req.params.y_coordinate,
      request_type: req.params.request_type,
    },
  });
  res.status(200).json("Pending Location deleted");
});

module.exports = router;