const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema);
