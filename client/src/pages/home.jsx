import React from "react";
import NavBar from "./../components/NavBar.jsx";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const Home = () => {
  const [markers, setMarkers] = useState([
    { id: 1, position: { lat: 37.7749, lng: -122.4194 }, name: "Marker 1" },
    // Add more markers as needed
  ]);

  //http://localhost:5000/api/user/stores
  //make use effect to call all stores for markers

  const [selectedMarker, setSelectedMarker] = useState(null);
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
          const encryptedId = CryptoJS.AES.encrypt(
            decodedToken.id,
            jwtSecret
          ).toString();
          const encryptedEmail = CryptoJS.AES.encrypt(
            decodedToken.email,
            jwtSecret
          ).toString();
          const encryptedUserType = CryptoJS.AES.encrypt(
            decodedToken.user_type,
            jwtSecret
          ).toString();
          const encryptedUsername = CryptoJS.AES.encrypt(
            decodedToken.username,
            jwtSecret
          ).toString();

          localStorage.setItem("decodedTokenId", encryptedId);
          localStorage.setItem("decodedTokenEmail", encryptedEmail);
          localStorage.setItem("decodedTokenUserType", encryptedUserType);
          localStorage.setItem("decodedTokenUsername", encryptedUsername);
        })
        .catch((error) => {
          console.error("Decode Token Error:", error.message);
        });
    }
  }, [token]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleDrawerClose = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <NavBar />
      <div style={{ height: "90vh", width: "100%", marginTop: "95px" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          zoom={9}
          center={{ lat: 10.3157, lng: 123.8854 }}
          options={{
            mapTypeId: "hybrid",
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            tilt: 0,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
        </GoogleMap>

        <Drawer
          anchor="bottom"
          open={!!selectedMarker}
          onClose={handleDrawerClose}
        >
          <List>
            <ListItem>
              <ListItemText primary={selectedMarker?.name || ""} />
            </ListItem>
            {/* Add more details as needed */}
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
