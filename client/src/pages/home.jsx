import React from "react";
import NavBar from "./../components/NavBar.jsx";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import default_avatar from "./../assets/default_avatar.jpg";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isSnackbarOpen, setisSnackbarOpen] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [zoomLevel, setZoomLevel] = useState(9);
  const [directionsText, setDirectionsText] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const MAP_MARKER =
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [storeUser, setStoreUser] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerDirections, setOpenDrawerDirections] = useState(false);
  const token = localStorage.getItem("token") ?? "";
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_id = localStorage.getItem("decodedTokenId") ?? "";
  const user_type = localStorage.getItem("decodedTokenUserType") ?? "";
  const decryptedtoken = CryptoJS.AES.decrypt(token, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const decryptedUserId = CryptoJS.AES.decrypt(user_id, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const decryptedUserType = CryptoJS.AES.decrypt(user_type, jwtSecret).toString(
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
    setOpenDrawer(true);
    setSelectedMarker(marker);
    getStoreUser(marker);
  };

  const closeSnackbar = () => {
    setisSnackbarOpen(false);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleDrawerCloseDirections = () => {
    setZoomLevel(9);
    setOpenDrawerDirections(false);
    setShowDirections(false);
    setDirectionsResponse(null);
  };

  const getCurrentLocation = () => {
    setUserLocation({
      lat: 10.352136269202115,
      lng: 123.91327011184387,
    });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
      },
      (error) => {
        console.error("Error getting current location:", error.message);
      }
    );
  };

  const handleCall = (Number) => {
    const telURI = `tel:${Number}`;
    window.open(telURI, "_blank");
  };

  const handleDirectionsClick = async (data) => {
    try {
      const { lat: userLat, lng: userLng } = userLocation ?? {};
      const { lat: storeLat, lng: storeLng } =
        data.store_location.geometry.location;
      const directionsService = new window.google.maps.DirectionsService();

      const response = await axios.post(
        `http://localhost:5000/api/historical/get_directions`,
        {
          userLat,
          userLng,
          storeLat,
          storeLng,
        }
      );

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(userLat, userLng),
          destination: new window.google.maps.LatLng(storeLat, storeLng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const directions = result.routes[0].legs[0].steps.map(
              (step) => step.instructions
            );
            setDirectionsText(directions);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
      const directionsResult = response.data;

      setDirectionsResponse(directionsResult);
      setShowDirections(true);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const handleTextFieldChange = (product_name, event) => {
    const { value } = event.target;

    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product_name]: value,
    }));
  };

  const handleChatClick = () => {
    const isNotEmptyObject = (obj) => {
      return Object.keys(obj).length > 0;
    };
    const isNotEmpty = isNotEmptyObject(productQuantities);
    if (isNotEmpty) {
      navigate("/Orders", {
        state: { productQuantities, storeUser, selectedMarker },
      });
    }
    setisSnackbarOpen(true);
    return;
  };

  const getStoreUser = async (marker) => {
    const response = await axios.get(
      `http://localhost:5000/api/user/stores_user/${marker?._id}`
    );
    setStoreUser(response.data);
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
    if (showDirections) {
      setOpenDrawerDirections(true);
    }
  }, [showDirections]);

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
          zoom={zoomLevel}
          center={
            showDirections
              ? undefined
              : {
                  lat: 10.3157,
                  lng: 123.8854,
                }
          }
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
          {showDirections && (
            <DirectionsService
              options={{
                origin: new window.google.maps.LatLng(
                  userLocation?.lat,
                  userLocation?.lng
                ),
                destination: new window.google.maps.LatLng(
                  selectedMarker?.store_location.geometry.location.lat,
                  selectedMarker?.store_location.geometry.location.lng
                ),
                travelMode: window.google.maps.TravelMode.DRIVING,
              }}
              callback={(result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  setDirectionsResponse(result);
                  setShowDirections(false);
                  handleDrawerClose();
                } else {
                  console.error("Directions request failed due to ", status);
                }
              }}
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer
              options={{
                directions: directionsResponse,
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={1000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            marginTop: "5rem",
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={closeSnackbar}
            severity="error"
          >
            Invalid Order
          </Alert>
        </Snackbar>
        <Drawer anchor="bottom" open={openDrawer} onClose={handleDrawerClose}>
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
                  {decryptedUserType === "seller" ? (
                    <></>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        marginRight: "10px",
                      }}
                    >
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleCall(selectedMarker?.store_contact_number)
                        }
                      >
                        <PhoneIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => handleDirectionsClick(selectedMarker)}
                      >
                        <DirectionsIcon />
                      </IconButton>

                      <IconButton color="success" onClick={handleChatClick}>
                        <ChatIcon />
                      </IconButton>
                    </Stack>
                  )}
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
              <div>
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
                {decryptedUserType === "seller" ? (
                  <></>
                ) : (
                  <ListItem>
                    <ListItemText>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <TextField
                          fullWidth
                          label="Quantity"
                          variant="filled"
                          value={productQuantities[product.product_name] || ""}
                          onChange={(event) => {
                            const isValidNumber = /^[0-9]*$/.test(
                              event.target.value
                            );
                            if (!isValidNumber) {
                              return;
                            }
                            handleTextFieldChange(product.product_name, event);
                          }}
                        />
                      </Grid>
                    </ListItemText>
                  </ListItem>
                )}
              </div>
            ))}
          </List>
        </Drawer>
        <Drawer
          anchor="bottom"
          open={openDrawerDirections}
          onClose={handleDrawerCloseDirections}
          PaperProps={{ style: { maxHeight: "200px" } }}
        >
          <IconButton
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
            onClick={handleDrawerCloseDirections}
            color="error"
          >
            <CloseIcon />
          </IconButton>
          <List>
            {directionsText.map((step, index) => (
              <ListItem key={index}>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
