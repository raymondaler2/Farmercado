const mongoose = require("mongoose");

const historical = mongoose.Schema({
  product_name: {
    type: String,
  },
  product_data: {
    type: [
      {
        date: {
          type: String,
        },
        product_price: {
          type: Number,
        },
      },
    ],
  },
});

const Historical = mongoose.model("Historical", historical);
module.exports = Historical;
