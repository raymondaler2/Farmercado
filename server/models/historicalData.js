const mongoose = require("mongoose");

const historicalData = mongoose.Schema({
  date: {
    type: String,
  },
  product_price: {
    type: Number,
  },
});

const Historical = mongoose.model("Historical", historicalData);
module.exports = Historical;
