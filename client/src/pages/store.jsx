import React, { useState, useEffect, useRef } from "react";
import NavBar from "./../components/NavBar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CryptoJS from "crypto-js";
import InventoryIcon from "@mui/icons-material/Inventory";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const Store = () => {
  const [locationErrorSnackbarOpen, setLocationErrorSnackbarOpen] =
    useState(false);
  const [noResultsSnackbarOpen, setNoResultsSnackbarOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpenError, setSnackbarOpenError] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedStoreProducts, setSelectedStoreProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_id = localStorage.getItem("decodedTokenId") ?? "";
  const decryptedUserId = CryptoJS.AES.decrypt(user_id, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const [newStoreDialogOpen, setNewStoreDialogOpen] = useState(false);
  const [locationSearch, SetLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    geometry: {
      location: {
        lat: 10.3157,
        lng: 123.8854,
      },
    },
  });

  const [newStoreInfo, setNewStoreInfo] = useState({
    store_name: "",
    store_description: "",
    store_contact_number: "",
    store_status: "Close",
    store_location: {},
    products: [],
  });
  console.log("%c Line:64 🍪 newStoreInfo", "color:#3f7cff", newStoreInfo);

  const handleLocationSearch = (value) => {
    SetLocationSearch(value);
  };

  const handleLocateStore = async () => {
    if (!locationSearch) {
      console.warn("No location to search");
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

    try {
      const response = await axios.get(baseUrl, {
        params: {
          address: locationSearch,
          key: apiKey,
        },
      });

      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];

        // Check if the located location is in Cebu, Philippines
        const isInCebu = firstResult.address_components.some((component) => {
          return component.long_name.toLowerCase() === "cebu";
        });

        if (isInCebu) {
          setSelectedLocation(firstResult);
          setNewStoreInfo((prevInfo) => ({
            ...prevInfo,
            store_location: firstResult,
          }));
        } else {
          setLocationErrorSnackbarOpen(true); // Show Snackbar for location error
        }
      } else {
        setNoResultsSnackbarOpen(true); // Show Snackbar for no results
      }
    } catch (error) {
      console.error("Error during location search:", error.message);
    }
  };

  // Function to open new store dialog
  const handleNewStoreClick = () => {
    if (stores.length === 2) {
      setSnackbarOpenError(true);
    } else {
      setNewStoreDialogOpen(true);
    }
  };

  // Function to close new store dialog
  const handleNewStoreDialogClose = () => {
    setNewStoreDialogOpen(false);
  };

  // Function to handle changes in new store info text fields
  const handleNewStoreInfoChange = (field, value) => {
    setNewStoreInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  // Function to create a new store
  const handleCreateStore = async () => {
    // Perform API call to create a new store using newStoreInfo
    // ...

    // Close the new store dialog after creating the store
    handleNewStoreDialogClose();
  };

  const handleProductButtonClick = (store) => {
    setSelectedStoreProducts(store.products);
    setProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setProductDialogOpen(false);
  };

  const fetchUserStores = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/user/${decryptedUserId}/stores`
    );
    setStores(response.data);
  };

  useEffect(() => {
    fetchUserStores();
  }, []);

  const handleDeleteClick = (store) => {
    setStoreToDelete(store);
    setDeleteDialogOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    window.location.reload();
    setSnackbarOpen(false);
  };

  const handleSnackbarCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpenError(false);
  };

  const handleDeleteConfirm = async () => {
    console.log("Deleting store:", storeToDelete);

    await axios
      .delete(
        `http://localhost:5000/api/user/${decryptedUserId}/stores/${storeToDelete._id}`
      )
      .then(() => {
        setSnackbarOpen(true);
      });

    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleSwitch = async (store) => {
    try {
      const newStatus = store.store_status === "Open" ? "Close" : "Open";

      setStores((prevStores) =>
        prevStores.map((prevStore) =>
          prevStore._id === store._id
            ? { ...prevStore, store_status: newStatus }
            : prevStore
        )
      );

      await axios.put(`http://localhost:5000/api/user/update_store_of_user`, {
        userId: decryptedUserId,
        storeId: store._id,
        store_status: newStatus,
      });
    } catch (error) {
      console.error("Handle Switch Error:", error.message);
    }
  };

  useEffect(() => {
    // Load Google Maps API only once
    if (!mapLoaded) {
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NavBar />
      <div className="p-4 max-w-full mx-auto">
        <div className="mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewStoreClick}
            style={{
              color: "white",
              backgroundColor: "#8BC34A",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "Bold",
            }}
          >
            New Store
          </Button>
        </div>
        <div className="overflow-x-auto w-full shadow-2xl">
          <TableContainer
            style={{
              width: "90vw",
              minWidth: "100%",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store._id}>
                    <TableCell>
                      <FormControl>
                        <Switch
                          onClick={() => handleSwitch(store)}
                          checked={store.store_status === "Open"}
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell>{store.store_name}</TableCell>
                    <TableCell>{`${store?.store_location?.formatted_address}`}</TableCell>

                    <TableCell>
                      {store.products.length > 0 && (
                        <IconButton
                          onClick={() => handleProductButtonClick(store)}
                          className="mb-2 cursor-pointer"
                        >
                          <InventoryIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDeleteClick(store)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Product List Dialog */}
      <Dialog
        PaperProps={{ style: { padding: "20px" } }}
        open={productDialogOpen}
        onClose={handleProductDialogClose}
      >
        <Divider>
          <Chip label="Produce List" color="success" />
        </Divider>
        <DialogContent>
          <List>
            {selectedStoreProducts.map((product) => {
              return (
                <ListItem key={product._id}>
                  <ListItemText
                    primary={product.product_name}
                    style={{ marginRight: "10px" }}
                  />
                  <ListItemText
                    primary={
                      <Chip color="warning" label={product.product_count} />
                    }
                    style={{ marginLeft: "10px", textAlign: "right" }}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              color: "white",
              backgroundColor: "#8BC34A",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "Bold",
            }}
            variant="contained"
            onClick={handleProductDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        fullWidth={true}
        maxWidth={"xs"}
        PaperProps={{ style: { padding: "20px" } }}
      >
        <DialogTitle color="error">Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this store?</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleDeleteCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Store Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        PaperProps={{ style: { padding: "20px" } }}
        open={newStoreDialogOpen}
        onClose={handleNewStoreDialogClose}
      >
        <DialogContent>
          <Divider>
            <Chip label="Store Information" color="success" />
          </Divider>
          <Grid className="pt-5" container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <div
                  style={{
                    height: "40vh",
                    width: "100%",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={{
                      height: "100%",
                      width: "100%",
                    }}
                    zoom={15}
                    center={{
                      lat: selectedLocation.geometry.location.lat,
                      lng: selectedLocation.geometry.location.lng,
                    }}
                    onLoad={(map) => {
                      if (!mapRef.current) {
                        mapRef.current = map;
                        setMapLoaded(true);
                      }
                    }}
                  >
                    <MarkerF
                      position={{
                        lat: selectedLocation.geometry.location.lat,
                        lng: selectedLocation.geometry.location.lng,
                      }}
                    />
                  </GoogleMap>
                </div>
                <Grid item xs={8}>
                  <TextField
                    label="Location"
                    value={locationSearch}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    onClick={handleLocateStore}
                    fullWidth
                  >
                    Locate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={newStoreInfo.store_name}
                onChange={(e) =>
                  handleNewStoreInfoChange("store_name", e.target.value)
                }
                className="mb-12"
                sx={{
                  marginBottom: "1rem",
                }}
              />
              <TextField
                label="Description"
                value={newStoreInfo.store_description}
                onChange={(e) =>
                  handleNewStoreInfoChange("store_description", e.target.value)
                }
                sx={{
                  marginBottom: "1rem",
                }}
              />
              <TextField
                label="Number"
                value={newStoreInfo.store_contact_number}
                onChange={(e) =>
                  handleNewStoreInfoChange(
                    "store_contact_number",
                    e.target.value
                  )
                }
                sx={{
                  marginBottom: "1rem",
                }}
              />
            </Grid>
          </Grid>
          <Divider>
            <Chip label="Produce List" color="success" />
          </Divider>
          {/* Nested Product fields */}
          <TextField
            label="Product Name"
            // value={newStoreInfo.products[0].product_name}
            onChange={(e) =>
              handleNewStoreInfoChange(
                "products",
                0,
                "product_name",
                e.target.value
              )
            }
          />
          <TextField
            label="Product Count"
            // value={newStoreInfo.products[0].product_count}
            onChange={(e) =>
              handleNewStoreInfoChange(
                "products",
                0,
                "product_count",
                e.target.value
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleNewStoreDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreateStore}
          >
            Create Store
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpenError}
        autoHideDuration={1000}
        onClose={handleSnackbarCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "5rem",
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarCloseError}
          severity="error"
        >
          Reached Maximum Number of Stores
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "5rem",
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          Store Deleted
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={locationErrorSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setLocationErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setLocationErrorSnackbarOpen(false)}
          severity="warning"
        >
          Located location is outside of Cebu, Philippines
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={noResultsSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setNoResultsSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setNoResultsSnackbarOpen(false)}
          severity="warning"
        >
          No results found for the location search
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Store;
