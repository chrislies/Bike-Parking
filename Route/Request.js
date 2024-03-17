const express = require("express");
const router = express.Router();
const Request = require("../Database/Model/Request");

router.get("/", async (req, res) => {
  try {
    // Fetch all locations from the database
    const type = await Request.findAll();

    // Extract x_coordinate and y_coordinate from each location
    const request_types = type.map((type) => {
      return {
        request_type: type.request_type,
       
      };
    });

    // Send the coordinates as a JSON response
    return res.json(request_types);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/",async(req,res)=>{
  let new_type =await Request.create(req.body);
  res.status(200).json(new_type);

});


router.delete("/:id", async (req, res) => {
  await Request.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("Request Type deleted");
});


router.delete("/", async (req, res) => {
  await Request.destroy({
    where: {
      request_type: req.parms.request_type,
    },
  });
  res.status(200).json("Request Type deleted");
});

module.exports = router;