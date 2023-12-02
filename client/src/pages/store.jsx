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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CryptoJS from "crypto-js";
import InventoryIcon from "@mui/icons-material/Inventory";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import default_avatar from "./../assets/default_avatar.jpg";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Store = () => {
  const [validationSnackbarOpen, setValidationSnackbarOpen] = useState(false);
  const [locateButtonClicked, setLocateButtonClicked] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successSnackbarOpenUpdate, setSuccessSnackbarOpenUpdate] =
    useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("No file selected.");
  const [selectedFileNameUpdate, setSelectedFileNameUpdate] =
    useState("No file selected.");
  const [profilePicture, setProfilePicture] = useState(null);
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
  const [validationError, setValidationError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedStoreOld, setSelectedStoreOld] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    geometry: {
      location: {
        lat: 10.3157,
        lng: 123.8854,
      },
    },
  });
  const [newStoreInfo, setNewStoreInfo] = useState({
    store_image: "",
    store_name: "",
    store_description: "",
    store_contact_number: "",
    store_status: "Close",
    store_location: {},
    products: [
      {
        product_name: "",
        product_count: "",
        product_price: "",
        product_status: "Available",
        product_image: "",
      },
    ],
  });
  const [productImages, setProductImages] = useState(
    Array(newStoreInfo.products.length).fill(null)
  );
  const [productImagesUpdate, setProductImagesUpdate] = useState(
    Array(newStoreInfo.products.length).fill(null)
  );
  const [productImageFileNames, setProductImageFileNames] = useState(
    Array(newStoreInfo.products.length).fill("No file selected.")
  );
  const [productImageFileNamesUpdate, setProductImageFileNamesUpdate] =
    useState(Array(newStoreInfo.products.length).fill("No file selected."));

  const handleProductImageChange = async (index, file) => {
    const fileName = file.name;

    setProductImageFileNames((prevFileNames) => {
      const updatedFileNames = [...prevFileNames];
      updatedFileNames[index] = fileName;
      return updatedFileNames;
    });

    setProductImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = URL.createObjectURL(file);
      return updatedImages;
    });

    try {
      const base64Image = await convertFileToBase64(file);

      setNewStoreInfo((prevInfo) => {
        const updatedProducts = [...prevInfo.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_image: base64Image,
        };
        return {
          ...prevInfo,
          products: updatedProducts,
        };
      });
    } catch (error) {
      console.error("Error converting file to base64:", error.message);
    }
  };

  const handleProductImageChangeUpdate = async (index, file) => {
    const fileName = file.name;

    setProductImageFileNamesUpdate((prevFileNames) => {
      const updatedFileNames = [...prevFileNames];
      updatedFileNames[index] = fileName;
      return updatedFileNames;
    });

    setProductImagesUpdate((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = URL.createObjectURL(file);
      return updatedImages;
    });

    try {
      const base64Image = await convertFileToBase64(file);

      setSelectedStore((prevStore) => {
        const updatedProducts = [...prevStore.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_image: base64Image,
        };
        return { ...prevStore, products: updatedProducts };
      });
    } catch (error) {
      console.error("Error converting file to base64 Update:", error.message);
    }
  };

  const handleValidationSnackbarClose = () => {
    setValidationSnackbarOpen(false);
  };

  const fetchStoreData = async (store) => {
    const { _id } = store;
    const result = await axios.get(
      `http://localhost:5000/api/user/${decryptedUserId}/stores/${_id}`
    );
    setSelectedStore(result.data);
  };

  const handleUpdateClick = (store) => {
    fetchStoreData(store);
    setUpdateDialogOpen(true);
    setSelectedStoreOld(store);
  };

  const handleUpdateDialogClose = () => {
    setSelectedStore(null);
    setUpdateDialogOpen(false);
  };

  const validateStoreInfoUpdate = () => {
    if (selectedStore?.store_location.formatted_address === "") {
      return "Invalid Store location.";
    }

    if (
      locateButtonClicked === false &&
      selectedStore?.store_location.formatted_address !==
        selectedStoreOld?.store_location.formatted_address
    ) {
      return "Invalid Store location.";
    }

    if (!selectedStore.store_name || !selectedStore.store_contact_number) {
      return "Invalid store information.";
    }

    for (const product of selectedStore.products) {
      if (
        !product.product_name ||
        !product.product_count ||
        !product.product_price
      ) {
        return "Invalid product information.";
      }
    }

    return "";
  };

  const handleUpdateStore = async () => {
    const error = validateStoreInfoUpdate();
    if (!!error) {
      setValidationError(error);
      setValidationSnackbarOpen(true);
      return;
    }
    await axios.put(`http://localhost:5000/api/user/update_store_of_user`, {
      userId: decryptedUserId,
      storeId: selectedStore._id,
      ...selectedStore,
    });

    setLocateButtonClicked(false);
    setSuccessSnackbarOpenUpdate(true);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const addNewProduct = () => {
    setNewStoreInfo((prevInfo) => ({
      ...prevInfo,
      products: [
        ...prevInfo.products,
        {
          product_name: "",
          product_count: "",
          product_price: "",
          product_status: "Available",
          product_image: "",
        },
      ],
    }));
  };

  const addNewProductUpdate = () => {
    setSelectedStore((prevStore) => ({
      ...prevStore,
      products: [
        ...prevStore?.products,
        {
          product_name: "",
          product_count: "",
          product_price: "",
          product_status: "Available",
          product_image: "",
        },
      ],
    }));
  };

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

        const isInCebu = firstResult.address_components.some((component) => {
          return component.long_name.toLowerCase() === "cebu";
        });

        if (isInCebu) {
          setLocateButtonClicked(true);
          setSelectedLocation(firstResult);
          SetLocationSearch(firstResult.formatted_address);
          setNewStoreInfo((prevInfo) => ({
            ...prevInfo,
            store_location: firstResult,
          }));
        } else {
          setLocationErrorSnackbarOpen(true);
        }
      } else {
        setNoResultsSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during location search:", error.message);
    }
  };

  const handleLocateStoreUpdate = async () => {
    if (!selectedStore?.store_location?.formatted_address) {
      console.warn("No location to search");
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

    try {
      const response = await axios.get(baseUrl, {
        params: {
          address: selectedStore?.store_location?.formatted_address,
          key: apiKey,
        },
      });

      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];

        const isInCebu = firstResult.address_components.some((component) => {
          return component.long_name.toLowerCase() === "cebu";
        });

        if (isInCebu) {
          setLocateButtonClicked(true);
          // setSelectedLocation(firstResult);
          // SetLocationSearch(firstResult.formatted_address);
          setSelectedStore((prevStore) => ({
            ...prevStore,
            store_location: firstResult,
          }));
        } else {
          setLocationErrorSnackbarOpen(true);
        }
      } else {
        setNoResultsSnackbarOpen(true);
      }
    } catch (error) {
      console.error(
        "Error during store update location search:",
        error.message
      );
    }
  };

  const handleNewStoreClick = () => {
    if (stores.length === 2) {
      setSnackbarOpenError(true);
    } else {
      setNewStoreDialogOpen(true);
    }
  };

  const handleNewStoreDialogClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setNewStoreInfo({
      store_image: "",
      store_name: "",
      store_description: "",
      store_contact_number: "",
      store_status: "Close",
      store_location: {},
      products: [
        {
          product_name: "",
          product_count: "",
          product_price: "",
          product_status: "Available",
          product_image: "",
        },
      ],
    });
    setLocateButtonClicked(false);
    SetLocationSearch("");
    setProfilePicture(null);
    setProductImages(Array(newStoreInfo.products.length).fill(null));
    setSelectedFileName("No file selected.");
    setProductImageFileNames(
      Array(newStoreInfo.products.length).fill("No file selected.")
    );
    setNewStoreDialogOpen(false);
  };

  const handleNewStoreDialogCloseUpdate = (event, reason) => {
    setLocateButtonClicked(false);
    setUpdateDialogOpen(false);
  };

  const handleNewStoreInfoChange = (field, value) => {
    if (field === "store_contact_number") {
      const isValidNumber = /^[0-9]*$/.test(value);
      if (!isValidNumber) {
        return;
      }
    }
    setNewStoreInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleNewProductChange = (index, subField, value) => {
    if (subField === "remove") {
      removeProduct(index);
    } else {
      if (subField === "product_count") {
        const isValidNumber = /^[0-9]*$/.test(value);
        if (!isValidNumber) {
          return;
        }
      }
      if (subField === "product_price") {
        const isValidNumber = /^(\d+(\.\d*)?|\.\d*)?$/.test(value);
        if (!isValidNumber) {
          return;
        }
      }
      setNewStoreInfo((prevInfo) => {
        const updatedProducts = [...prevInfo.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          [subField]: value,
        };
        return {
          ...prevInfo,
          products: updatedProducts,
        };
      });
    }
  };

  const handleNewProductChangeUpdate = (index, subField, value) => {
    if (subField === "remove") {
      removeProductUpdate(index);
    } else {
      if (subField === "product_count") {
        const isValidNumber = /^[0-9]*$/.test(value);
        if (!isValidNumber) {
          return;
        }
      }
      if (subField === "product_price") {
        const isValidNumber = /^(\d+(\.\d*)?|\.\d*)?$/.test(value);
        if (!isValidNumber) {
          return;
        }
      }
      setSelectedStore((prevStore) => {
        const updatedProducts = [...prevStore.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          [subField]: value,
        };
        return { ...prevStore, products: updatedProducts };
      });
    }
  };

  const validateStoreInfo = () => {
    if (locationSearch && !locateButtonClicked) {
      return "Invalid Store location.";
    }

    if (
      !newStoreInfo.store_name ||
      !newStoreInfo.store_location ||
      !newStoreInfo.store_contact_number
    ) {
      return "Invalid store information.";
    }

    for (const product of newStoreInfo.products) {
      if (
        !product.product_name ||
        !product.product_count ||
        !product.product_price
      ) {
        return "Invalid product information.";
      }
    }

    return "";
  };

  const handleCreateStore = async () => {
    const error = validateStoreInfo();
    if (!!error) {
      setValidationError(error);
      setValidationSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/user/add_store_to_user`, {
        userId: decryptedUserId,
        storeInfo: {
          store_name: newStoreInfo?.store_name ?? "",
          store_description: newStoreInfo?.store_description ?? "",
          store_contact_number: newStoreInfo?.store_contact_number ?? "",
          store_status: newStoreInfo?.store_status ?? "",
          store_location: newStoreInfo?.store_location ?? "",
          store_image: newStoreInfo?.store_image ?? "",
        },
        productsInfo: newStoreInfo?.products ?? [],
      });

      setSuccessSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating store:", error.message);
      setErrorSnackbarOpen(true);
    }

    handleNewStoreDialogClose();
  };

  const handleProductButtonClick = (store) => {
    setSelectedStoreProducts(store.products);
    setProductDialogOpen(true);
  };

  const base64ToImageUrl = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleProductDialogClose = () => {
    setProductDialogOpen(false);
  };

  const handleImageChange = (file) => {
    setProfilePicture(URL.createObjectURL(file));
    setSelectedFileName(file.name);

    convertFileToBase64(file)
      .then((base64String) => {
        setNewStoreInfo((prevInfo) => ({
          ...prevInfo,
          store_image: base64String,
        }));
      })
      .catch((error) => {
        console.error("Error converting file to base64:", error.message);
      });
  };

  const handleImageChangeUpdate = (file) => {
    setSelectedStore((prevStore) => ({
      ...prevStore,
      store_image: file,
    }));

    setSelectedFileNameUpdate(file.name);
    convertFileToBase64(file)
      .then((base64StringUpdate) => {
        setSelectedStore((prevStore) => ({
          ...prevStore,
          store_image: base64StringUpdate,
        }));
      })
      .catch((error) => {
        console.error("Error converting file to base64 Update:", error.message);
      });
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

  const truncateFilename = (filename, maxLength) => {
    if (!filename || filename.length <= maxLength) {
      return filename || "";
    }

    const extension = filename.split(".").pop();
    const truncatedFilename =
      filename.substring(0, maxLength - extension.length - 4) +
      ` ... .${extension}`;
    return truncatedFilename;
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
    await axios
      .delete(
        `http://localhost:5000/api/user/${decryptedUserId}/stores/${storeToDelete._id}`
      )
      .then(() => {
        setSnackbarOpen(true);
      });

    setDeleteDialogOpen(false);
  };

  const removeProduct = (index) => {
    setNewStoreInfo((prevInfo) => ({
      ...prevInfo,
      products: prevInfo.products.filter((_, i) => i !== index),
    }));
  };

  const removeProductUpdate = (index) => {
    setSelectedStore((prevStore) => ({
      ...prevStore,
      products: prevStore.products.filter((_, i) => i !== index),
    }));
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
                    <TableCell
                      onClick={() => handleUpdateClick(store)}
                      style={{ cursor: "pointer" }}
                    >
                      {store.store_name}
                    </TableCell>
                    <TableCell
                      onClick={() => handleUpdateClick(store)}
                      style={{ cursor: "pointer" }}
                    >
                      {`${store?.store_location?.formatted_address}`}
                    </TableCell>
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
                <ListItem key={product?._id}>
                  <ListItemText
                    primary={product?.product_name}
                    style={{ marginRight: "10px" }}
                  />
                  <ListItemText
                    primary={
                      <Chip color="warning" label={product?.product_count} />
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
                    options={{
                      mapTypeId: "hybrid",
                      streetViewControl: false,
                      fullscreenControl: false,
                      mapTypeControl: false,
                      tilt: 0,
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
                    required
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
                    style={{
                      padding: "15px",
                      color: "white",
                      backgroundColor: "#039be5",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "Bold",
                    }}
                  >
                    Locate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={newStoreInfo.store_name}
                onChange={(e) =>
                  handleNewStoreInfoChange("store_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Number"
                value={newStoreInfo.store_contact_number}
                onChange={(e) =>
                  handleNewStoreInfoChange(
                    "store_contact_number",
                    e.target.value
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newStoreInfo.store_description}
                onChange={(e) =>
                  handleNewStoreInfoChange("store_description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div className="flex justify-center items-center">
                <img
                  src={profilePicture ?? default_avatar}
                  alt="Profile"
                  style={{
                    width: "60%",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="upload-container-store mb-5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  style={{ display: "none" }}
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="upload-button"
                >
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      color: "white",
                      backgroundColor: "#039be5",
                      textTransform: "none",
                    }}
                  >
                    Browse
                  </Button>
                </label>
                <div className="upload-info">
                  <p className="text-[#69717a]">
                    {truncateFilename(selectedFileName, 20) ??
                      "No file selected."}
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
          <Divider>
            <Chip label="Produce List" color="success" />
          </Divider>
          {newStoreInfo.products.map((product, index) => {
            return (
              <>
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: "2rem" }}
                >
                  <Grid item xs={12}>
                    <div className="flex items-center mb-2 mt-3">
                      <IconButton
                        onClick={() => addNewProduct()}
                        style={{
                          color: "#8BC34A",
                          backgroundColor: "transparent",
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      {newStoreInfo.products.length > 1 && (
                        <IconButton
                          onClick={() =>
                            handleNewProductChange(index, "remove", null)
                          }
                          style={{
                            color: "#FF5722",
                            backgroundColor: "transparent",
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="product-name">Name</InputLabel>
                      <Select
                        label="Name"
                        id="product-name"
                        value={product?.product_name}
                        onChange={(e) =>
                          handleNewProductChange(
                            index,
                            "product_name",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value={"Ampalaya"}>Ampalaya</MenuItem>
                        <MenuItem value={"Beans"}>Beans</MenuItem>
                        <MenuItem value={"Bell pepper"}>Bell pepper</MenuItem>
                        <MenuItem value={"Cabbage"}>Cabbage</MenuItem>
                        <MenuItem value={"Carrots"}>Carrots</MenuItem>
                        <MenuItem value={"Chili (espada)"}>
                          Chili (espada)
                        </MenuItem>
                        <MenuItem value={"Eggplant"}>Eggplant</MenuItem>
                        <MenuItem value={"Gabi"}>Gabi</MenuItem>
                        <MenuItem value={"Onion Leeks"}>Onion Leeks</MenuItem>
                        <MenuItem value={"Pechay"}>Pechay</MenuItem>
                        <MenuItem value={"Sayote"}>Sayote</MenuItem>
                        <MenuItem value={"Squash"}>Squash</MenuItem>
                        <MenuItem value={"Sweet Potato"}>Sweet Potato</MenuItem>
                        <MenuItem value={"Tomato"}>Tomato</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label={`Count`}
                      value={product?.product_count}
                      onChange={(e) =>
                        handleNewProductChange(
                          index,
                          "product_count",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label={`Price`}
                      value={product?.product_price}
                      onChange={(e) =>
                        handleNewProductChange(
                          index,
                          "product_price",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Status</InputLabel>
                      <Select
                        labelId="select-label"
                        label="Status"
                        value={product?.product_status}
                        onChange={(e) =>
                          handleNewProductChange(
                            index,
                            "product_status",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="flex justify-center items-center">
                      <img
                        src={productImages[index] ?? default_avatar}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "40%",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="upload-container-store mb-5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleProductImageChange(index, e.target.files[0])
                        }
                        style={{ display: "none" }}
                        id={`product-image-upload-${index}`}
                      />
                      <label
                        htmlFor={`product-image-upload-${index}`}
                        className="upload-button"
                      >
                        <Button
                          variant="contained"
                          component="span"
                          style={{
                            color: "white",
                            backgroundColor: "#039be5",
                            textTransform: "none",
                          }}
                        >
                          Browse
                        </Button>
                      </label>
                      <div className="upload-info">
                        <p className="text-[#69717a]">
                          {truncateFilename(
                            productImageFileNames[index] || "",
                            20
                          ) || "No file selected."}
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Divider></Divider>
              </>
            );
          })}
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
        autoHideDuration={2000}
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
          Outside of Cebu, Philippines
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={noResultsSnackbarOpen}
        autoHideDuration={1000}
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
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSuccessSnackbarOpen(false);
          window.location.reload();
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSuccessSnackbarOpen(false);
            window.location.reload();
          }}
          severity="success"
        >
          Store Created Successfully
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={1000}
        onClose={() => setErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setErrorSnackbarOpen(false)}
          severity="error"
        >
          Error creating store
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={validationSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleValidationSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleValidationSnackbarClose}
          severity="error"
        >
          {validationError}
        </MuiAlert>
      </Snackbar>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        PaperProps={{ style: { padding: "20px" } }}
        open={updateDialogOpen}
        onClose={handleUpdateDialogClose}
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
                      lat: selectedStore?.store_location.geometry.location.lat,
                      lng: selectedStore?.store_location.geometry.location.lng,
                    }}
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
                      position={{
                        lat: selectedStore?.store_location.geometry.location
                          .lat,
                        lng: selectedStore?.store_location.geometry.location
                          .lng,
                      }}
                    />
                  </GoogleMap>
                </div>
                <Grid item xs={8}>
                  <TextField
                    required
                    label="Location"
                    value={
                      selectedStore?.store_location?.formatted_address || ""
                    }
                    onChange={(e) => {
                      setSelectedStore((prevStore) => ({
                        ...prevStore,
                        store_location: {
                          ...prevStore.store_location,
                          formatted_address: e.target.value,
                        },
                      }));
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    onClick={handleLocateStoreUpdate}
                    fullWidth
                    style={{
                      padding: "15px",
                      color: "white",
                      backgroundColor: "#039be5",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "Bold",
                    }}
                  >
                    Locate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={selectedStore?.store_name || ""}
                onChange={(e) => {
                  setSelectedStore((prevStore) => ({
                    ...prevStore,
                    store_name: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Number"
                value={selectedStore?.store_contact_number || ""}
                onChange={(e) => {
                  setSelectedStore((prevStore) => ({
                    ...prevStore,
                    store_contact_number: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={selectedStore?.store_description || ""}
                onChange={(e) => {
                  setSelectedStore((prevStore) => ({
                    ...prevStore,
                    store_description: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="flex justify-center items-center">
                <img
                  src={
                    selectedStore?.store_image !== ""
                      ? base64ToImageUrl(selectedStore?.store_image)
                      : default_avatar
                  }
                  alt="Profile"
                  style={{
                    width: "60%",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="upload-container-store mb-5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChangeUpdate(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="upload-button"
                >
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      color: "white",
                      backgroundColor: "#039be5",
                      textTransform: "none",
                    }}
                  >
                    Browse
                  </Button>
                </label>
                <div className="upload-info">
                  <p className="text-[#69717a]">
                    {truncateFilename(selectedFileNameUpdate, 20) ??
                      "No file selected."}
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
          <Divider>
            <Chip label="Produce List" color="success" />
          </Divider>
          {selectedStore?.products.map((product, index) => {
            return (
              <>
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: "2rem" }}
                >
                  <Grid item xs={12}>
                    <div className="flex items-center mb-2 mt-3">
                      <IconButton
                        onClick={() => addNewProductUpdate()}
                        style={{
                          color: "#8BC34A",
                          backgroundColor: "transparent",
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      {selectedStore?.products.length > 1 && (
                        <IconButton
                          onClick={() =>
                            handleNewProductChangeUpdate(index, "remove", null)
                          }
                          style={{
                            color: "#FF5722",
                            backgroundColor: "transparent",
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="product-name">Name</InputLabel>
                      <Select
                        label="Name"
                        id="product-name"
                        value={product?.product_name}
                        onChange={(e) =>
                          handleNewProductChangeUpdate(
                            index,
                            "product_name",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value={"Ampalaya"}>Ampalaya</MenuItem>
                        <MenuItem value={"Beans"}>Beans</MenuItem>
                        <MenuItem value={"Bell pepper"}>Bell pepper</MenuItem>
                        <MenuItem value={"Cabbage"}>Cabbage</MenuItem>
                        <MenuItem value={"Carrots"}>Carrots</MenuItem>
                        <MenuItem value={"Chili (espada)"}>
                          Chili (espada)
                        </MenuItem>
                        <MenuItem value={"Eggplant"}>Eggplant</MenuItem>
                        <MenuItem value={"Gabi"}>Gabi</MenuItem>
                        <MenuItem value={"Onion Leeks"}>Onion Leeks</MenuItem>
                        <MenuItem value={"Pechay"}>Pechay</MenuItem>
                        <MenuItem value={"Sayote"}>Sayote</MenuItem>
                        <MenuItem value={"Squash"}>Squash</MenuItem>
                        <MenuItem value={"Sweet Potato"}>Sweet Potato</MenuItem>
                        <MenuItem value={"Tomato"}>Tomato</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label={`Count`}
                      value={product?.product_count}
                      onChange={(e) =>
                        handleNewProductChangeUpdate(
                          index,
                          "product_count",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label={`Price`}
                      value={product?.product_price}
                      onChange={(e) =>
                        handleNewProductChangeUpdate(
                          index,
                          "product_price",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Status</InputLabel>
                      <Select
                        labelId="select-label"
                        label="Status"
                        value={product?.product_status}
                        onChange={(e) =>
                          handleNewProductChangeUpdate(
                            index,
                            "product_status",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="flex justify-center items-center">
                      <img
                        src={
                          productImagesUpdate[index] ??
                          (product?.product_image !== ""
                            ? base64ToImageUrl(product?.product_image)
                            : default_avatar)
                        }
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "40%",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="upload-container-store mb-5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleProductImageChangeUpdate(
                            index,
                            e.target.files[0]
                          )
                        }
                        style={{ display: "none" }}
                        id={`product-image-upload-${index}`}
                      />
                      <label
                        htmlFor={`product-image-upload-${index}`}
                        className="upload-button"
                      >
                        <Button
                          variant="contained"
                          component="span"
                          style={{
                            color: "white",
                            backgroundColor: "#039be5",
                            textTransform: "none",
                          }}
                        >
                          Browse
                        </Button>
                      </label>
                      <div className="upload-info">
                        <p className="text-[#69717a]">
                          {truncateFilename(
                            productImageFileNamesUpdate[index] || "",
                            20
                          ) || "No file selected."}
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Divider></Divider>
              </>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleNewStoreDialogCloseUpdate}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateStore}
          >
            Update Store
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successSnackbarOpenUpdate}
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSuccessSnackbarOpenUpdate(false);
          handleUpdateDialogClose();
          window.location.reload();
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "5rem" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSuccessSnackbarOpenUpdate(false);
            window.location.reload();
          }}
          severity="success"
        >
          Store Updated Successfully
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Store;
