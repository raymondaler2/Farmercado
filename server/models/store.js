const mongoose = require("mongoose");
const Product = require("./product");

const storeSchema = mongoose.Schema({
  store_name: {
    type: String,
  },
  store_image: {
    type: String,
  },
  store_image_url: {
    type: String,
  },
  store_description: {
    type: String,
  },
  store_contact_number: {
    type: String,
  },
  store_status: {
    type: String,
  },
  store_location: {
    type: Object,
  },
  products: {
    type: [Product.schema],
  },
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
