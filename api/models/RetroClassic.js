const mongoose = require("mongoose");
const retroClassicSchema = mongoose.Schema({
  hitsArtistName: {
    type: String,
  },
  hitsArtistImage: {
    type: String,
  },
});
module.exports = mongoose.model("RetroClassic", retroClassicSchema);
