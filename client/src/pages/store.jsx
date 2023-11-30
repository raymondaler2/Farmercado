import React, { useState, useEffect } from "react";
import NavBar from "./../components/NavBar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js";

const Store = () => {
  const [stores, setStores] = useState([]);
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_id = localStorage.getItem("decodedTokenId") ?? "";
  const decryptedUserId = CryptoJS.AES.decrypt(user_id, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  console.log(
    "%c Line:21 🍇 decryptedUserId",
    "color:#b03734",
    decryptedUserId
  );

  const fetchUserStores = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/user/${decryptedUserId}/stores`
    );
    console.log("%c Line:29 🍰 response", "color:#b03734", response);
    setStores(response);
  };

  useEffect(() => {
    fetchUserStores();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NavBar />
      <div className="p-4 max-w-screen-xl mx-auto">
        <div className="mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("New Store Clicked")}
          >
            New Store
          </Button>
        </div>
        <div className="overflow-x-auto w-full">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store._id}>
                    <TableCell>{store.store_status}</TableCell>
                    <TableCell>{store.store_name}</TableCell>
                    <TableCell>{`${store.store_location.latitude}, ${store.store_location.longitude}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Store;
