const mongoose = require("mongoose");
const newReleaseSchema = mongoose.Schema({
  songName: {
    type: String,
  },
  artist: {
    type: String,
  },
  songImage: {
    type: String,
  },
  songUrl: {
    type: String,
  },
});
module.exports = mongoose.model("NewRelease", newReleaseSchema);
