const mongoose = require("mongoose");
const featureArtistsSchema = mongoose.Schema({
  artistName: {
    type: String,
  },
  artistImage: {
    type: String,
  },
});
module.exports = mongoose.model("FeatureArtists", featureArtistsSchema);
