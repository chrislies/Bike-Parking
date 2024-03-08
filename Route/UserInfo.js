const express = require("express");
const router = express.Router();
const UserInfo = require("../Database/Model/UserInfo");

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const info = await UserInfo.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const user_email = user_email.map((info) => {
      return {
       user_email: info.user_email,
      };
    });

    // Send the coordinates as a JSON response
    return res.json(user_email);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;