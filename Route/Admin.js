const express = require("express");
const router = express.Router();
const Admin = require("../Database/Model/Admin");

router.get("/", async (req, res) => {
  try {
    // Fetch all admins from the database
    const admin = await Admin.findAll();

    // Extract username and password from each admin
    const admin_info = admin.map((admin) => {
      return {
       username: admin.username,
       password: admin.password,
      };
    });

    // Send the admin_infos as a JSON response
    return res.json(admin_info);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;