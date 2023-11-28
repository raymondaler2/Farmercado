import React from "react";
import NavBar from "./../components/NavBar.jsx";

const NotFound = () => {
  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center h-screen">
        <p className="text-4xl text-red-600">404 - Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
