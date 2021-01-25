const express = require("express");
const router = express.Router();
const Radio = require("../models/Radio");
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
  if (!req.file) {
    return res.send({
      success: false,
    });
  } else {
    return res.send({
      success: true,
      songImage: `https://music-player-app26.herokuapp.com/uploads/${req.file.filename}`,
    });
  }
});

//INSERT DATA //
router.post("/create-radio", (req, res) => {
  const radio = new Radio({
    radioName: req.body.radioName,
    radioImage: req.body.radioImage,
  });
  radio
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Radio Created Successfully",
        createdRadio: result,
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
router.get("/get-radio", (req, res, next) => {
  Radio.find()
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

// //GET BY ID//
// router.get("/:MusicId", (req, res, next) => {
//   const id = req.params.MusicId;
//   Radio.findById(id)
//     .exec()
//     .then((doc) => {
//       console.log("From Database", doc);
//       if (doc) {
//         res.status(200).json(doc);
//       } else {
//         res.status(404).json({ message: "No valid record found" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

module.exports = router;
