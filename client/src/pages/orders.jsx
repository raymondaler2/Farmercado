import React from "react";
import NavBar from "./../components/NavBar.jsx";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const location = useLocation();
  const { productQuantities } = location.state || {};
  console.log(
    "%c Line:11 🍋 productQuantities",
    "color:#ea7e5c",
    productQuantities
  );

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center h-screen">
        <p className="text-4xl text-black">ORDERS PAGE</p>
      </div>
    </div>
  );
};

export default Orders;
