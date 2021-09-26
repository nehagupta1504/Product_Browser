const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  passwordHash: String,
  email: {
    type: String,
    unique: true,
  },
  favourites: [], //t0 contain product id
});

//User is the name of the collection
const User = mongoose.model("User", userSchema);

module.exports = User;
