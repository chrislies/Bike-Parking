const express = require("express");
const router = express.Router();
const Favorite = require("../Database/Model/Favorite");

router.get("/", async (req, res) => {
  try {

    // Fetch all favorites from the database
    const favorites = await Favorite.findAll();

    // Extract Location and User from each favorite
    const liked = favorites.map((favorite) => {
      return {
        Location: favorite.Location,
        User: favorite.User,

      };
    });

    // Send the liked as a JSON response
    return res.json(liked);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;