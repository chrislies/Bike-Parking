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

module.exports = router;