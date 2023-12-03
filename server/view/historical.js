const express = require("express");

const { add_product_to_historical } = require("./../controllers/historical");

const router = express.Router();
router.post("/add_product_to_historical", add_product_to_historical);

module.exports = router;
