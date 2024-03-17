const express = require("express");
const router = express.Router();
const Admin = require("../Database/Model/Admin");

router.get("/", async (req, res) => {
  try {
    // Fetch all admins from the database
    const info = await Admin.findAll();

    // Extract username and password from each admin
    const admin_info = info.map((info) => {
      return {
       username: info.username,
       password: info.password,
      };
    });

    // Send the admin_infos as a JSON response
    return res.json(admin_info);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/",async(req,res)=>{
  let new_admin =await Admin.create(req.body);
  res.status(200).json(new_admin);

});


router.delete("/:id", async (req, res) => {
  await Admin.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("Admin deleted");
});


router.delete("/", async (req, res) => {
  await Admin.destroy({
    where: {
      username: req.parms.username,
      password: req.parms.password,
    },
  });
  res.status(200).json("Admin deleted");
});


module.exports = router;