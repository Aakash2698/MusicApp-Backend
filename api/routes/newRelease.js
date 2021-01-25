const express = require("express");
const router = express.Router();
const NewRelease = require("../models/NewRelease");
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

router.post("/upload", upload.single("songImage"), (req, res, next) => {
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
      songImage: `https://music-player-app26.herokuapp.com/uploads/${req.file.filename}`,
    });
  }
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

//INSERT DATA //
router.post("/create-new-release", (req, res) => {
  const newRelease = new NewRelease({
    songName: req.body.songName,
    artistName: req.body.artistName,
    songImage: req.body.songImage,
    songUrl: req.body.songUrl,
  });
  newRelease
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "NewRelease Created Successfully",
        createdNewRelease: result,
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
router.get("/get-new-release", (req, res, next) => {
  NewRelease.find()
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

//GET BY ID//
router.get("/:MusicId", (req, res, next) => {
  const id = req.params.MusicId;
  NewRelease.findById(id)
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid record found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
