import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CryptoJS from "crypto-js";
import InventoryIcon from "@mui/icons-material/Inventory";

const Store = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handleDeleteConfirm = async () => {
    console.log("Deleting store:", storeToDelete);

    await axios
      .delete(
        `http://localhost:5000/api/user/${decryptedUserId}/stores/${storeToDelete._id}`
      )
      .then(() => {
        setSnackbarOpen(true); // Open Snackbar on successful delete
      });

    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NavBar />
      <div className="p-4 max-w-full mx-auto">
        <div className="mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("New Store Clicked")}
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
                        <Switch checked={store.store_status === "Open"} />
                      </FormControl>
                    </TableCell>
                    <TableCell>{store.store_name}</TableCell>
                    <TableCell>{`${store.store_location.latitude}, ${store.store_location.longitude}`}</TableCell>

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
      <Dialog open={productDialogOpen} onClose={handleProductDialogClose}>
        <DialogTitle>{`Store Produce`}</DialogTitle>
        <DialogContent>
          <List>
            {selectedStoreProducts.map((product) => (
              <ListItem key={product._id}>
                <ListItemText primary={product.product_name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleProductDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle color="error">Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this store?</p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDeleteCancel}>
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
    </div>
  );
};

export default Store;
