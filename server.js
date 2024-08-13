require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const candidateRoute = require("./routes/candidate");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(bodyParser.json());

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("The MONGODB_URI environment variable is not set.");
}

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use("/user", userRoute);
app.use("/candidate", candidateRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
