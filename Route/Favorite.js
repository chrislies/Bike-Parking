const express = require("express");
const router = express.Router();
const Favorite = require("../Database/Model/Favorite");

router.get("/", async (req, res) => {
  try {

    // Fetch all favorites from the database
    const info = await Favorite.findAll();

    // Extract Location and User from each favorite
    const liked = info.map((info) => {
      return {
        location_id: info.location_id,
        user_id: info.user_id,
      };
    });

    // Send the liked as a JSON response
    return res.json(liked);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/",async(req,res)=>{
  let new_favorite=await Favorite.create(req.body);
  res.status(200).json(new_favorite);

});

router.delete("/:id", async (req, res) => {
  await Favorite.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("Favorite Location deleted");
});


router.delete("/", async (req, res) => {
  await Favorite.destroy({
    where: {
      location_id: req.params.location_id,
      user_id: req.params.user_id,
    },
  });
  res.status(200).json("Favorite Location deleted");
});

module.exports = router;