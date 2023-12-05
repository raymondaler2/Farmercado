const Historical = require("../models/historical");
const asyncHandler = require("express-async-handler");
const linearRegression = require("linear-regression");
const axios = require("axios");

const addProductToHistorical = async (productArray) => {
  try {
    for (const productInfo of productArray) {
      const { product_name, product_price, date } = productInfo;
      const currentDate = date || new Date().toISOString().slice(0, 10);

      let existingProduct = await Historical.findOne({ product_name });

      if (existingProduct) {
        const existingRecord = existingProduct.product_data.find(
          (record) => record.date === currentDate
        );

        if (existingRecord) {
          existingRecord.product_price =
            (existingRecord.product_price + Number(product_price)) / 2;
        } else {
          existingProduct.product_data.push({
            date: currentDate,
            product_price: Number(product_price),
          });
        }

        await existingProduct.save();
      } else {
        const newProductData = new Historical({
          product_name,
          product_data: [
            {
              date: currentDate,
              product_price: Number(product_price),
            },
          ],
        });
        await newProductData.save();
      }
    }

    return "Products added to historical data successfully.";
  } catch (error) {
    return `Error adding products to historical data: ${error.message}`;
  }
};

const forecast_prices = asyncHandler(async (req, res) => {
  try {
    const productsData = await Historical.find();

    const forecastedPrices = [];

    productsData.forEach((product) => {
      const dates = product.product_data.map((entry) =>
        new Date(entry.date).getTime()
      );
      const prices = product.product_data.map((entry) => entry.product_price);

      if (dates.length >= 2) {
        const result = linearRegression(
          dates.map((date, index) => [date, prices[index]])
        );

        if (result && result.a !== undefined && result.b !== undefined) {
          const currentDateTimestamp = new Date().getTime();
          const forecastedPrice = result.a * currentDateTimestamp + result.b;

          forecastedPrices.push({
            product_name: product.product_name,
            forecasted_price: forecastedPrice,
          });
        } else {
          console.error(
            "Linear regression result or coefficients are undefined:",
            result
          );
        }
      } else {
        console.error("Insufficient data points for linear regression");
      }
    });

    res.status(200).json(forecastedPrices);
  } catch (error) {
    res.status(500).json({ error: "forecast_prices ERROR" });
  }
});

const add_product_to_historical = asyncHandler(async (req, res) => {
  try {
    const productArray = req.body;

    const result = await addProductToHistorical(productArray);

    res.status(200).json({ message: `${result}` });
  } catch (error) {
    console.error("Controller Function ERROR:", error.message);
    res.status(500).json({ error: `${result}` });
  }
});

const get_all = asyncHandler(async (req, res) => {
  try {
    const data = await Historical.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Get All Historical ERROR" });
  }
});

const get_directions = asyncHandler(async (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    const { userLat, userLng, storeLat, storeLng } = req.body;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${userLat},${userLng}&destination=${storeLat},${storeLng}&key=${apiKey}`
    );
    res.status(200).json(response.data); // Send only the data property
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Get Directions ERROR" });
  }
});

module.exports = {
  get_directions,
  add_product_to_historical,
  forecast_prices,
  get_all,
};
