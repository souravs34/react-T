const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // Converts json to javascript objects and calls next

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://Sourav:souravx234@cluster0.zb6es.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
