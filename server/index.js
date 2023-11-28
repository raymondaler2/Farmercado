require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./view/user");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

// * Routes
app.get("/", (req, res) => {
  res.send("API RESPONSE");
});

app.use("/api/user", userRoute);

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Connected to userDB`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`DB Error:`, error);
  });
