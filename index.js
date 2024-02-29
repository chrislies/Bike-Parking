const db = require("./Database/Connect");
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use("/", require("./Route/location"));

db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
