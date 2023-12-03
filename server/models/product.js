const mongoose = require("mongoose");
const historicalData = require("./historical");

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
  historicalData: {
    type: [historicalData.schema],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
