const Historical = require("../models/historical");
const asyncHandler = require("express-async-handler");

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

module.exports = {
  add_product_to_historical,
};
