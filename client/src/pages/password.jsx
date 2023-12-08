import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "./../components/NavBar.jsx";
import axios from "axios";

const Change = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValidPassword = validatePassword(password);

    if (isValidPassword) {
      await axios.put(`http://localhost:5000/api/user/change_password`, {
        email: email,
        newPassword: password,
      });
      setEmail("");
      setPassword("");

      setSnackbarSeverity("success");
      setSnackbarMessage("Password Changed successfully");
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Password should contain at least one uppercase letter, one lowercase letter, one special character, one number and should atleast be 5 characters long"
      );
    }

    setIsSnackbarOpen(true);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 5;
    const isStrongPassword =
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar;

    return isStrongPassword;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <NavBar />
      <div className="bg-white">
        <h1 className="text-center leading-[60px] text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Change Password
        </h1>
        <Container component="main">
          <Paper elevation={3} className="mt-8 p-4 flex flex-col items-center">
            <Avatar className="bg-blue-500">
              <LockOutlinedIcon />
            </Avatar>
            <h2 className="text-xl font-bold mb-4 mt-4 text-center text-[#444444;]">
              Enter Your New Password
            </h2>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-3"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="new-password"
              label="New Password"
              name="new-password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="mt-3"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
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

export default Change;
