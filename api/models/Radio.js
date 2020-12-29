const mongoose = require("mongoose");
const radioSchema = mongoose.Schema({
  radioName: {
    type: String,
  },
  radioImage: {
    type: String,
  },
});
module.exports = mongoose.model("Radio", radioSchema);
