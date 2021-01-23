const express = require("express");
const router = express.Router();
const Genres = require("../models/Genres");
const Songs = require("../models/Songs");
const multer = require("multer");

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
  console.log(req);
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

//GET ALLDATA //
router.get("/all-genres", (req, res, next) => {
  Genres.find()
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

router.get("/:genresType", async (req, res) => {
  try {
    const getSongs = await Songs.find();
    const filterSongs = getSongs.filter((item) =>
      item.genresType.includes(req.params.genresType)
    );
    const getArtists = await Genres.find();
    const filterArtist = getArtists.filter((item) => {
      return item.genresName.includes(req.params.genresType);
    });
    res.json({ songs: filterSongs, artists: filterArtist });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
