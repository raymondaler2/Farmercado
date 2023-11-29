import React from "react";
import NavBar from "./../components/NavBar.jsx";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const token = localStorage.getItem("token") ?? "";
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const decryptedtoken = CryptoJS.AES.decrypt(token, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );

  const decodeToken = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/decode_token",
        { token }
      );

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Decode Token Error:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      decodeToken(decryptedtoken)
        .then((decodedToken) => {
          localStorage.setItem("decodedToken", JSON.stringify(decodedToken));
        })
        .catch((error) => {
          console.error("Decode Token Error:", error.message);
        });
    }
  }, [token]);

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
