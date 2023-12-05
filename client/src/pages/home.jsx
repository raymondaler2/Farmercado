import React from "react";
import NavBar from "./../components/NavBar.jsx";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import default_avatar from "./../assets/default_avatar.jpg";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const MAP_MARKER =
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  console.log("%c Line:17 🍡 selectedMarker", "color:#7f2b82", selectedMarker);
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

  const FetchMarkers = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/user/stores`);
      const filteredMarkers = result.data.filter(
        (store) => store.store_status !== "Close"
      );

      setMarkers(filteredMarkers);
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleDrawerClose = () => {
    setSelectedMarker(null);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: 10.352136269202115,
          lng: 123.91327011184387,
        });
      },
      (error) => {
        console.error("Error getting current location:", error.message);
      }
    );
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

  useEffect(() => {
    if (!mapLoaded) {
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  useEffect(() => {
    getCurrentLocation();
    FetchMarkers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <NavBar />
      <div style={{ height: "90vh", width: "100%", marginTop: "95px" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          zoom={9}
          center={{ lat: 10.3157, lng: 123.8854 }}
          onLoad={(map) => {
            if (!mapRef.current) {
              mapRef.current = map;
              setMapLoaded(true);
            }
          }}
          options={{
            mapTypeId: "hybrid",
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            tilt: 0,
          }}
        >
          <MarkerF
            key={"user_location"}
            position={{
              lat: userLocation?.lat,
              lng: userLocation?.lng,
            }}
          />
          {markers?.map((marker) => (
            <MarkerF
              icon={{
                path: MAP_MARKER,
                scale: 2,
                fillColor: "rgb(4,156,228)",
                fillOpacity: 1,
                strokeColor: "hsla(52, 71%, 80%, 1)",
                anchor: { x: 12, y: 24 },
              }}
              key={marker._id}
              position={{
                lat: marker.store_location.geometry.location.lat,
                lng: marker.store_location.geometry.location.lng,
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
        </GoogleMap>
        <Drawer
          anchor="bottom"
          open={!!selectedMarker}
          onClose={handleDrawerClose}
        >
          <IconButton
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
            onClick={handleDrawerClose}
            color="error"
          >
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem>
              {!selectedMarker?.store_image ? (
                <Grid container justifyContent="center" alignItems="center">
                  <img
                    src={default_avatar}
                    alt="Profile"
                    className="w-40 h-40 rounded-full ml-10"
                  />
                </Grid>
              ) : (
                <Grid container justifyContent="center" alignItems="center">
                  <img
                    src={`data:image/png;base64,${selectedMarker?.store_image}`}
                    alt="Profile"
                    className="w-40 h-40 rounded-full ml-10"
                  />
                </Grid>
              )}
            </ListItem>
            <ListItem>
              <ListItemText>
                <div className="flex justify-center items-center ml-4">
                  <p className="text-3xl">{selectedMarker?.store_name || ""}</p>
                </div>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  className="ml-1"
                >
                  <center>
                    <p className="text-xl">
                      {selectedMarker?.store_location.formatted_address || ""}
                    </p>
                  </center>
                </Grid>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Grid container justifyContent="center" alignItems="center">
                  <a
                    href={`tel:${selectedMarker?.store_contact_number || ""}`}
                    className="text-xl"
                  >
                    {selectedMarker?.store_contact_number || ""}
                  </a>
                </Grid>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Grid container justifyContent="center" alignItems="center">
                  <center>
                    <p className="text-xl">
                      {selectedMarker?.store_description || ""}
                    </p>
                  </center>
                </Grid>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  className="mr-10"
                >
                  <center>
                    <p className="text-xl mb-4 font-black">Products</p>
                  </center>
                </Grid>
              </ListItemText>
            </ListItem>
            {selectedMarker?.products.map((product) => (
              <ListItem key={product._id}>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  className="mb-5 mr-14"
                >
                  <img
                    src={
                      !!product?.product_image
                        ? `data:image/png;base64,${product?.product_image}`
                        : default_avatar
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full"
                  />
                  <div className="flex flex-col ml-5">
                    <p className="text-xl">{product.product_name}</p>
                    <p className="text-lg">{`Count: ${product.product_count}`}</p>
                    <p className="text-lg">{`Price: ₱ ${product.product_price}`}</p>
                  </div>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
