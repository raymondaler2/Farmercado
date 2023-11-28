import React from "react";
import NavBar from "./../components/NavBar.jsx";

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center h-screen">
        <p className="text-4xl">Home</p>
      </div>
    </div>
  );
};

export default Home;
