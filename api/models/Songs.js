const mongoose = require("mongoose");
const songsSchema = mongoose.Schema({
  songName: {
    type: String,
  },
  artistName: {
    type: String,
  },
  songImage: {
    type: String,
  },
  songUrl: {
    type: String,
  },
  duration: {
    type: String,
  },
  launguage: {
    type: String,
  },
  genresType: {
    type: String,
  },
  hitsArtistName: {
    type: String,
  },
  count: {
    type: String,
  },
  songType: {
    type: String,
  },
});
module.exports = mongoose.model("Songs", songsSchema);
