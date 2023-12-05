const express = require("express");

const {
  add_product_to_historical,
  get_all,
  forecast_prices,
  get_directions,
} = require("./../controllers/historical");

const router = express.Router();
router.post("/get_directions", get_directions);
router.get("/", get_all);
router.get("/forecast_prices", forecast_prices);
router.post("/add_product_to_historical", add_product_to_historical);

module.exports = router;
