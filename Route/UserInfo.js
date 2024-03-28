const express = require("express");
const router = express.Router();
const UserInfo = require("../Database/Model/UserInfo");
const cors = require("cors"); 

router.get("/", async (req, res) => {
  try {
    // Fetch all user information from the database
    const userInfo = await UserInfo.findAll();

    // Extract user emails from each entry
    const user_emails = userInfo.map((info) => {
      return {
       user_email: info.user_email,
      };
    });

    // Send the user emails as a JSON response
    return res.json(user_emails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Create a new user with the provided data
    const newUser = await UserInfo.create({
      // Add other fields as needed (x_coordinate, y_coordinate, Site_ID, racktype, IFOAddress)
      // For example:
      x_coordinate: req.body.x_coordinate,
      y_coordinate: req.body.y_coordinate,
      Site_ID: req.body.Site_ID,
      racktype: req.body.racktype,
      IFOAddress: req.body.IFOAddress,
    });

    // Send the newly created user as a JSON response
    return res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Delete the user with the specified ID
    await UserInfo.destroy({
      where: {
        id: req.params.id,
      },
    });

    // Send a success message
    return res.status(200).json("User deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    // Delete the user(s) with the specified email(s)
    await UserInfo.destroy({
      where: {
        user_email: req.params.user_email,
      },
    });

    // Send a success message
    return res.status(200).json("User deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

