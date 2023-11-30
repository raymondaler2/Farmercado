const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
  },
  product_count: {
    type: Number,
  },
  product_price: {
    type: Number,
  },
  product_status: {
    type: String,
  },
  product_image: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
