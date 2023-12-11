import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { CircularProgress, Grid, TextField } from "@mui/material";

const Prices = () => {
  const [chartData, setChartData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [forecastPrices, setForecastPrices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("Ampalaya");
  const [filteredChartData, setFilteredChartData] = useState(chartData);
  const [selectedProductForecast, setSelectedProductForecast] = useState(0);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState("Monthly");

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
    const productNames = Array.from(
      new Set([
        ...productData.flatMap((product) => product.product_name),
        ...forecastPrices.map((forecast) => forecast.product_name),
      ])
    );

    const formattedChartData = [["Date", ...productNames]];

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

    const todayRow = [new Date()];
    productNames.forEach((productName) => {
      const forecastPrice =
        forecastPrices.find((forecast) => forecast.product_name === productName)
          ?.forecasted_price || 0;
      todayRow.push(forecastPrice);
    });
    formattedChartData.push(todayRow);

    setChartData(formattedChartData);
  }, [productData, forecastPrices]);

  const handleProductChange = (event) => {
    const selectedProduct = event.target.value;
    setSelectedProduct(selectedProduct);
    updateForecastedPrice(selectedProduct);
  };

  const updateForecastedPrice = (selectedProduct) => {
    const forecastedPrice =
      forecastPrices.find(
        (forecast) => forecast.product_name === selectedProduct
      )?.forecasted_price || 0;
    const roundedForecastPrice = parseFloat(forecastedPrice).toFixed(2);
    setSelectedProductForecast(roundedForecastPrice);
  };

  useEffect(() => {
    const productIndex = chartData[0]?.indexOf(selectedProduct);

    const filteredData = (array, index) => {
      if (index >= 0 && index < array[0].length) {
        return array.map((row) => [row[0], row[index]]);
      } else {
        console.error("Index out of bounds");
        return null;
      }
    };

    const resultArray = filteredData(chartData, productIndex);
    setFilteredChartData(resultArray);
    updateForecastedPrice(selectedProduct);
  }, [selectedProduct, chartData]);

  const handleTimeIntervalChange = (event) => {
    const selectedInterval = event.target.value;
    setSelectedTimeInterval(selectedInterval);
  };

  return productData.length === 0 && forecastPrices.length === 0 ? (
    <>
      <center>
        <CircularProgress />
      </center>
    </>
  ) : (
    <>
      <div>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={6}>
            <FormControl>
              <InputLabel id="time-interval-select-label">Interval</InputLabel>
              <Select
                variant="filled"
                labelId="time-interval-select-label"
                id="time-interval-select"
                value={selectedTimeInterval}
                onChange={handleTimeIntervalChange}
                className="mr-2"
              >
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                variant="filled"
                labelId="product-select-label"
                id="product-select"
                value={selectedProduct}
                onChange={handleProductChange}
                className="mr-2"
              >
                {productData.map((product) => (
                  <MenuItem key={product._id} value={product.product_name}>
                    {product.product_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              style={{ width: "5rem" }}
              id="forecast-price"
              variant="filled"
              value={selectedProductForecast}
            />
          </Grid>
        </Grid>
      </div>
      <div>
        <Chart
          width={"100%"}
          height={"70vh"}
          chartType="LineChart"
          loader={
            <center>
              <CircularProgress />
            </center>
          }
          data={filteredChartData}
          options={{
            title: "Prices Over Time",
            animation: {
              duration: 1000,
              easing: "out",
              startup: true,
            },
            hAxis: {
              title: "Date",
              format: (() => {
                switch (selectedTimeInterval) {
                  case "Weekly":
                    return "MMM dd, yyyy";
                  case "Monthly":
                    return "MMM yyyy";
                  case "Yearly":
                    return "yyyy";
                  default:
                    return "MMM dd, yyyy";
                }
              })(),
            },
            vAxis: {
              title: "Price",
            },
            legend: "none",
          }}
        />
      </div>
    </>
  );
};

export default Prices;
