import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const Prices = () => {
  const [chartData, setChartData] = useState([]);
  const [productData, setProductData] = useState([]);
  console.log("%c Line:8 🍏 productData", "color:#2eafb0", productData);
  const [forecastPrices, setForecastPrices] = useState([]);
  console.log("%c Line:9 🍰 forecastPrices", "color:#ea7e5c", forecastPrices);

  const fetchData = async () => {
    try {
      const [historicalResult, forecastResult] = await Promise.all([
        axios.get(`http://localhost:5000/api/historical/`),
        axios.get(`http://localhost:5000/api/historical/forecast_prices`),
      ]);

      setProductData(historicalResult.data);
      setForecastPrices(forecastResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Extract unique product names
    const productNames = Array.from(
      new Set(productData.flatMap((product) => product.product_name))
    );

    // Initialize chartData with header row
    const formattedChartData = [["Date", ...productNames]];

    // Populate chartData with product prices for each date
    const dateSet = new Set(
      productData.flatMap((product) =>
        product.product_data.map((entry) => entry.date)
      )
    );
    const dates = Array.from(dateSet).sort();

    dates.forEach((date) => {
      const dateRow = [new Date(date)];
      productNames.forEach((productName) => {
        const product = productData.find(
          (product) => product.product_name === productName
        );
        const productPrice = product
          ? product.product_data.find((entry) => entry.date === date)
              ?.product_price || 0
          : 0;
        dateRow.push(productPrice);
      });
      formattedChartData.push(dateRow);
    });

    setChartData(formattedChartData);
  }, [productData]);

  return (
    <>
      <div>
        <Chart
          width={"100%"}
          height={"70vh"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: "Product Prices Over Time",
            hAxis: {
              title: "Date",
              format: "MMM yyyy", // Adjust the date format as needed
            },
            vAxis: {
              title: "Product Price",
            },
          }}
        />
      </div>
    </>
  );
};

export default Prices;
