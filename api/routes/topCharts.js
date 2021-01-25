const express = require("express");
const router = express.Router();
const TopCharts = require("../models/TopCharts");
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
      ImagePath: `https://music-player-app26.herokuapp.com/uploads/${req.file.filename}`,
    });
  }
});

//INSERT DATA //
router.post("/create-top-charts", (req, res) => {
  const topCharts = new TopCharts({
    chartName: req.body.chartName,
    chartImage: req.body.chartImage,
  });
  topCharts
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Top Charts Created Successfully",
        createdTopCharts: result,
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
      songUrl: `https://music-player-app26.herokuapp.com/uploads/${req.file.filename}`,
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

router.get("/all-artists-details", (req, res, next) => {
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
router.get("/all-top-charts", (req, res, next) => {
  TopCharts.find()
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

// router.get("/:artistName", async (req, res) => {
//   try {
//     const getSongs = await Songs.find();
//     const filterSongs = getSongs.filter((item) =>
//       item.artistName.includes(req.params.artistName)
//     );

//     const getArtists = await TopCharts.find();
//     const filterArtist = getArtists.filter((item) => {
//       return item.artistName.includes(req.params.artistName);
//     });
//     res.json({ songs: filterSongs, artists: filterArtist });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).send("server error");
//   }
// });

router.get("/:chartName", async (req, res) => {
  try {
    const getSongs = await Songs.find();
    const filterSongs = getSongs.filter(
      (item) => item.launguage === req.params.chartName
    );
    const getArtists = await TopCharts.find();
    const filterArtist = getArtists.filter(
      (item) => item.chartName === req.params.chartName
    );
    res.json({ songs: filterSongs, artists: filterArtist });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
