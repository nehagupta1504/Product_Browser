const mongoose = require("mongoose");

const { Schema, Types } = mongoose;

const favouriteSchema = new Schema({
  username: {
    type: String,
  },
  productsIds: [Types.ObjectId],
});

const Favorite = mongoose.model("Favorite", favouriteSchema);

module.exports = Favorite;
