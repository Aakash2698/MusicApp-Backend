const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Songs = require("../models/Songs");
const FeatureArtists = require("../models/FeatureArtists");
const RetroClassic = require("../models/RetroClassic");
const TopCharts = require("../models/TopCharts");
const Radio = require("../models/Radio");
const Genres = require("../models/Genres");
const multer = require("multer");
const path = require("path");
const { fstat } = require("fs");

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
router.post("/create-genres", (req, res) => {
  const genres = new Genres({
    genresName: req.body.genresName,
    genresImage: req.body.genresImage,
  });
  genres
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Genres Artists Created Successfully",
        createdGenres: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/upload-music", upload.single("songUrl"), (req, res, next) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
    });
  } else {
    console.log("file received");
    return res.send({
      success: true,
      songUrl: `http://localhost:4000/uploads/${req.file.filename}`,
    });
  }
});

router.get("/download/:id", async (req, res) => {
  const song = await Songs.find({ _id: req.params.id });
  const filePath = song[0].songUrl.split("0/");
  res.download(filePath[1], song[0].songName + ".mp3");
});

// router.get("/download", function (req, res, next) {
//   var filePath = "uploads/1608534678221.mp3";
//   res.download(filePath);
// });

router.post("/create-artists-details", (req, res) => {
  const songs = new Songs({
    songName: req.body.songName,
    artistName: req.body.artistName,
    songImage: req.body.songImage,
    songUrl: req.body.songUrl,
    duration: req.body.duration,
    launguage: req.body.launguage,
    genresType: req.body.genresType,
    hitsArtistName: req.body.hitsArtistName,
    songType: req.body.songType,
  });
  songs
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Songs Created Successfully",
        createdSongs: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/all-songs", (req, res, next) => {
  Songs.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/searchAll/:searchText", async (req, res) => {
  try {
    const searchString = req.params.searchText;

    const getTopCharts = await TopCharts.find();
    const filterTopCharts = getTopCharts.filter((data) =>
      new RegExp(searchString, "i").test(data.chartName)
    );

    const getAlbum = await FeatureArtists.find();
    const filterAlbumData = getAlbum.filter((data) =>
      new RegExp(searchString, "i").test(data.artistName)
    );

    const getSongs = await Songs.find();
    const filterSongData = getSongs.filter((data) =>
      new RegExp(searchString, "i").test(data.songName)
    );

    const getRetro = await RetroClassic.find();
    const filterRetroClassic = getRetro.filter((data) =>
      new RegExp(searchString, "i").test(data.hitsArtistName)
    );

    const getRadio = await Radio.find();
    const filterRadio = getRadio.filter((data) =>
      new RegExp(searchString, "i").test(data.radioName)
    );

    const getGenres = await Genres.find();
    const filterGenres = getGenres.filter((data) =>
      new RegExp(searchString, "i").test(data.genresName)
    );

    res.json({
      topChartsData: filterTopCharts,
      albumData: filterAlbumData,
      songData: filterSongData,
      retroClassic: filterRetroClassic,
      radioData: filterRadio,
      genresData: filterGenres,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:musicType", async (req, res) => {
  try {
    const getSongs = await Songs.find();
    const filterSongs = getSongs.filter((item) =>
      item.songType.includes(req.params.musicType)
    );
    // const getArtists = await Genres.find();
    // const filterArtist = getArtists.filter((item) => {
    //   return item.songType.includes(req.params.musicType);
    // });
    res.json({ songs: filterSongs });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
