const express = require("express");
const router = express.Router();
const Request = require("../Database/Model/Request");

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const requests = await Request.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const request_types = requests.map((request) => {
      return {
        request_type: request.request_type,
       
      };
    });

    // Send the coordinates as a JSON response
    return res.json(request_types);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;