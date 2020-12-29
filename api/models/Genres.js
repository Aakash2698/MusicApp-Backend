const mongoose = require("mongoose");
const genresSchema = mongoose.Schema({
  genresName: {
    type: String,
  },
  genresImage: {
    type: String,
  },
});
module.exports = mongoose.model("Genres", genresSchema);
