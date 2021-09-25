const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb://localhost:27017/newton_school_product_browser")
  .then(() => {
    console.log("Connection Successful.");
  });

module.exports = db;
