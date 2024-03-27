const express = require("express");
const router = express.Router();
const UserInfo = require("../Database/Model/UserInfo");
const cors = require("cors"); 

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const info = await UserInfo.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const user_email = info.map((info) => {
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


router.post("/",async(req,res)=>{
  let new_user =await UserInfo.create(req.body);
  res.status(200).json(new_user);

});


router.delete("/:id", async (req, res) => {
  await UserInfo.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("User deleted");
});


router.delete("/", async (req, res) => {
  await UserInfo.destroy({
    where: {
      user_email: req.parms.user_email,
    },
  });
  res.status(200).json("User deleted");
});


module.exports = router;
