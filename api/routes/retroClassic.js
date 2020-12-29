const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const RetroClassic = require("../models/RetroClassic");
const multer = require("multer");
const path = require("path");
const Songs = require("../models/Songs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("Image"), (req, res, next) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
    });
  } else {
    console.log("file received");
    return res.send({
      success: true,
      ImagePath: `http://localhost:4000/uploads/${req.file.filename}`,
    });
  }
});

//INSERT DATA //
router.post("/create-retro-classic", (req, res) => {
  const retroClassic = new RetroClassic({
    hitsArtistName: req.body.hitsArtistName,
    hitsArtistImage: req.body.hitsArtistImage,
  });
  retroClassic
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "RetroClassic Created Successfully",
        createdRetroClassic: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//GET ALLDATA //
router.get("/get-retro-classic", (req, res, next) => {
  RetroClassic.find()
    .exec()
    .then((docs) => {
      console.log(docs);

      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:hitsArtistName", async (req, res) => {
  try {
    const getSongs = await Songs.find();
    const filterSongs = getSongs.filter((item) =>
      item.hitsArtistName.includes(req.params.hitsArtistName)
    );
    const getArtists = await RetroClassic.find();
    const filterArtist = getArtists.filter((item) => {
      return item.hitsArtistName.includes(req.params.hitsArtistName);
    });
    res.json({ songs: filterSongs, artists: filterArtist });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
