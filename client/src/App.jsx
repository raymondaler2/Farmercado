import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import NotFound from "./pages/notfound.jsx";
import Register from "./pages/register.jsx";
import Information from "./pages/Information.jsx";
import Store from "./pages/store.jsx";
import Orders from "./pages/orders.jsx";
import Lost from "./pages/lostpassword.jsx";
import Change from "./pages/password.jsx";
import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState, createContext } from "react";
import axios from "axios";

export const YearlyDataContext = createContext();
export const MonthlyDataContext = createContext();
export const WeeklyDataContext = createContext();

const MAP_LIBRARIES = ["places"];
const App = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const gethistorical = async () => {
    const historicalResult = await axios.get(
      `http://localhost:5000/api/historical/`
    );
    setHistoricalData(historicalResult.data);
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  };

  const computeWeeklyData = () => {
    const weeklyData = [];

    historicalData.forEach((product) => {
      const weeklyProductData = {
        _id: product._id,
        product_name: product.product_name,
        product_data: [],
        __v: product.__v,
      };

      let currentWeek = [];
      let currentWeekNumber;

      product.product_data.forEach((dailyData) => {
        const date = new Date(dailyData.date);
        const weekNumber = getWeekNumber(date);

        if (weekNumber !== currentWeekNumber) {
          if (currentWeek.length > 0) {
            const averagePrice =
              currentWeek.reduce((sum, data) => sum + data.product_price, 0) /
              currentWeek.length;

            weeklyProductData.product_data.push({
              date: currentWeek[0].date,
              product_price: averagePrice,
            });
          }

          currentWeek = [dailyData];
          currentWeekNumber = weekNumber;
        } else {
          currentWeek.push(dailyData);
        }
      });

      if (currentWeek.length > 0) {
        const averagePrice =
          currentWeek.reduce((sum, data) => sum + data.product_price, 0) /
          currentWeek.length;

        weeklyProductData.product_data.push({
          date: currentWeek[0].date,
          product_price: averagePrice,
        });
      }

      weeklyData.push(weeklyProductData);
    });

    setWeeklyData(weeklyData);
  };

  const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  const computeMonthlyData = () => {
    const monthlyData = [];

    historicalData.forEach((product) => {
      const monthlyProductData = {
        _id: product._id,
        product_name: product.product_name,
        product_data: [],
        __v: product.__v,
      };

      let currentMonth = [];
      let currentMonthYear;

      product.product_data.forEach((dailyData) => {
        const date = new Date(dailyData.date);
        const monthYear = getMonthYear(date);

        if (monthYear !== currentMonthYear) {
          if (currentMonth.length > 0) {
            const averagePrice =
              currentMonth.reduce((sum, data) => sum + data.product_price, 0) /
              currentMonth.length;

            monthlyProductData.product_data.push({
              date: currentMonth[0].date,
              product_price: averagePrice,
            });
          }

          currentMonth = [dailyData];
          currentMonthYear = monthYear;
        } else {
          currentMonth.push(dailyData);
        }
      });

      if (currentMonth.length > 0) {
        const averagePrice =
          currentMonth.reduce((sum, data) => sum + data.product_price, 0) /
          currentMonth.length;

        monthlyProductData.product_data.push({
          date: currentMonth[0].date,
          product_price: averagePrice,
        });
      }

      monthlyData.push(monthlyProductData);
    });

    setMonthlyData(monthlyData);
  };

  const computeYearlyData = () => {
    const yearlyData = [];

    historicalData.forEach((product) => {
      const yearlyProductData = {
        _id: product._id,
        product_name: product.product_name,
        product_data: [],
        __v: product.__v,
      };

      let currentYear = [];
      let currentYearNumber;

      product.product_data.forEach((dailyData) => {
        const date = new Date(dailyData.date);
        const yearNumber = date.getFullYear();

        if (yearNumber !== currentYearNumber) {
          if (currentYear.length > 0) {
            const averagePrice =
              currentYear.reduce((sum, data) => sum + data.product_price, 0) /
              currentYear.length;

            yearlyProductData.product_data.push({
              date: currentYear[0].date,
              product_price: averagePrice,
            });
          }

          currentYear = [dailyData];
          currentYearNumber = yearNumber;
        } else {
          currentYear.push(dailyData);
        }
      });

      if (currentYear.length > 0) {
        const averagePrice =
          currentYear.reduce((sum, data) => sum + data.product_price, 0) /
          currentYear.length;

        yearlyProductData.product_data.push({
          date: currentYear[0].date,
          product_price: averagePrice,
        });
      }

      yearlyData.push(yearlyProductData);
    });

    setYearlyData(yearlyData);
  };

  useEffect(() => {
    if (
      historicalData.length >= 1 &&
      weeklyData.length === 0 &&
      monthlyData.length === 0 &&
      yearlyData.length === 0
    ) {
      computeWeeklyData();
      computeMonthlyData();
      computeYearlyData();
    }
  }, [historicalData]);

  useEffect(() => {
    gethistorical();
  }, []);

  return (
    <YearlyDataContext.Provider value={yearlyData}>
      <MonthlyDataContext.Provider value={monthlyData}>
        <WeeklyDataContext.Provider value={weeklyData}>
          <div>
            <LoadScript
              key={googleMapsApiKey}
              googleMapsApiKey={googleMapsApiKey}
              libraries={MAP_LIBRARIES}
            >
              <Routes>
                <Route index element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/Store" element={<Store />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Information" element={<Information />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Lost" element={<Lost />} />
                <Route path="/Change" element={<Change />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LoadScript>
          </div>
        </WeeklyDataContext.Provider>
      </MonthlyDataContext.Provider>
    </YearlyDataContext.Provider>
  );
};

export default App;
