import React, { useState } from "react";
import NavBar from "./../components/NavBar.jsx";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PasswordStrengthIndicator from "./../components/PasswordStrengthIndicator .jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (snackbarSeverity === "success") {
      navigate("/login");
    }

    setIsSnackbarOpen(false);
  };

  const checkFormValidity = () => {
    const fields = [
      firstName,
      lastName,
      username,
      email,
      confirmEmail,
      password,
      confirmPassword,
    ];

    const isAllFieldsFilled = fields.every((field) => field.trim() !== "");
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

    setIsFormValid(isAllFieldsFilled && isStrongPassword);
  };

  const handleInputChange = (valueSetter, value) => {
    valueSetter(value);
    checkFormValidity();
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSnackbarSeverity("error");
      openSnackbar("Invalid email address");
      return;
    }

    if (email !== confirmEmail) {
      setSnackbarSeverity("error");
      openSnackbar("Email addresses do not match");
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarSeverity("error");
      openSnackbar("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user", {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        user_type: role,
      });

      if (response.status === 200) {
        setSnackbarSeverity("success");
        openSnackbar("Registration successful", "success");
      } else {
        setSnackbarSeverity("error");
        openSnackbar("Registration failed", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === "Email Address already exists") {
          setSnackbarSeverity("error");
          openSnackbar("Email Address already exists", "error");
        } else if (error.response.data.error === "Username already exists") {
          setSnackbarSeverity("error");
          openSnackbar("Username already exists", "error");
        } else {
          setSnackbarSeverity("error");
          openSnackbar("Registration failed", "error");
        }
      } else {
        console.error("Error during registration:", error);
        setSnackbarSeverity("error");
        openSnackbar("Registration failed", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <NavBar />
      <div className="bg-white pt-[10rem] mb-20">
        <h1 className="text-2xl text-center text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Register
        </h1>
        <div className="bg-white p-8 rounded w-96 shadow-2xl mt-4">
          <h2 className="text-xl font-bold mb-4 text-center text-[#444444;]">
            Create an Account
          </h2>
          <form>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => handleInputChange(setFirstName, e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => handleInputChange(setLastName, e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => handleInputChange(setUsername, e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => handleInputChange(setEmail, e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Confirm Email Address"
              fullWidth
              margin="normal"
              value={confirmEmail}
              onChange={(e) =>
                handleInputChange(setConfirmEmail, e.target.value)
              }
              variant="outlined"
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => handleInputChange(setPassword, e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showconfirmPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) =>
                handleInputChange(setConfirmPassword, e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowconfirmPassword(!showconfirmPassword)
                      }
                    >
                      {showconfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <PasswordStrengthIndicator password={password} />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => {
                  setRole(e.target.value);
                  checkFormValidity();
                }}
                className="mb-[16px]"
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRegister}
              disabled={!isFormValid}
              style={
                !isFormValid
                  ? {
                      color: "white",
                      opacity: "0.5",
                      backgroundColor: "#8BC34A",
                      textTransform: "none",
                      padding: "20px 10px 20px 10px",
                      fontSize: "16px",
                      fontWeight: "Bold",
                    }
                  : {
                      color: "white",
                      backgroundColor: "#8BC34A",
                      textTransform: "none",
                      padding: "20px 10px 20px 10px",
                      fontSize: "16px",
                      fontWeight: "Bold",
                    }
              }
            >
              Register
            </Button>
          </form>
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
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
        <div className="text-center mt-8 text-[#69717a]">
          <p>
            <Link to="/login" className="hover:underline">
              Have an account? Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
