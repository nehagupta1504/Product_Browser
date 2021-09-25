const mongoose = require("mongoose");

const { Schema } = mongoose;

//Description of product collection
const productSchema = new Schema({
  product_name: String,
  quantity: Number,
  price: Number,
  Description: String,
});

//registers the description
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
