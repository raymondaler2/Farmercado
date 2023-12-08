import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "./../components/NavBar.jsx";
import axios from "axios";

const Lost = () => {
  const [email, setEmail] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValidEmail = validateEmail(email);

    if (isValidEmail) {
      await axios.put(`http://localhost:5000/api/user/forgot_password`, {
        email: email,
      });
      setSnackbarSeverity("success");
      setSnackbarMessage("Email sent successfully! Please check your email");
      setEmail("");
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Invalid email address");
    }

    setIsSnackbarOpen(true);
  };

  const validateEmail = (email) => {
    const minLength = 5;
    const maxLength = 255;

    const isLengthValid =
      email.length >= minLength && email.length <= maxLength;
    const hasValidSpecialCharacters = /^[a-zA-Z0-9@._-]+$/.test(email);
    const isValidDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email.split("@")[1]
    );
    const hasSingleAtSymbol = email.split("@").length === 2;

    return (
      isLengthValid &&
      hasValidSpecialCharacters &&
      isValidDomain &&
      hasSingleAtSymbol
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <NavBar />
      <div className="bg-white">
        <h1 className="text-center leading-[60px] text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Lost Password
        </h1>
        <Container component="main">
          <Paper elevation={3} className="mt-8 p-4 flex flex-col items-center">
            <Avatar className="bg-blue-500">
              <LockOutlinedIcon />
            </Avatar>
            <h2 className="text-xl font-bold mb-4 mt-4 text-center text-[#444444;]">
              Enter Your Email Addrress
            </h2>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              className="mt-3"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                marginTop: "20px",
                backgroundColor: "#8BC34A",
                textTransform: "none",
                padding: "20px 10px 20px 10px",
                fontSize: "16px",
                fontWeight: "Bold",
              }}
            >
              Submit
            </Button>
          </Paper>
          <div className="text-center mt-8 text-[#69717a]">
            <p>
              <Link to="/register" className="hover:underline">
                Register
              </Link>{" "}
              |{" "}
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </p>
          </div>
        </Container>
      </div>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
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
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Lost;
