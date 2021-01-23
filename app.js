const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;

const user = require("./api/routes/user");
const topCharts = require("./api/routes/topCharts");
const newRelease = require("./api/routes/newRelease");
const retroClassic = require("./api/routes/retroClassic");
const radio = require("./api/routes/radio");
const FeatureArtists = require("./api/routes/featureArtists");
const genres = require("./api/routes/genres");
const songs = require("./api/routes/songs");

let db;
mongoose.connect(
  "mongodb://localhost/tunexdb",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, Database) => {
    if (!err) {
      console.log("Database connection successfully");
    }
    db = Database;
  }
);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/", user);
app.use("/topcharts", topCharts);
app.use("/new-release", newRelease);
app.use("/retro-classic", retroClassic);
app.use("/radio", radio);
app.use("/feature-artists", FeatureArtists);
app.use("/genres", genres);
app.use("/songs", songs);
module.exports = app;
