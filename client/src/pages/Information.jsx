import React, { useState, useEffect } from "react";
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
import default_avatar from "./../assets/default_avatar.jpg";

const Information = () => {
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
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageChange = (file) => {
    setProfilePicture(file);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
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

    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(
      password
    );

    setIsFormValid(isAllFieldsFilled && isStrongPassword);
  };

  const handleInputChange = (valueSetter, value) => {
    valueSetter(value);
    checkFormValidity();
  };

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      openSnackbar("Invalid email address");
      return;
    }

    if (email !== confirmEmail) {
      openSnackbar("Email addresses do not match");
      return;
    }

    if (password !== confirmPassword) {
      openSnackbar("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/user", {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        user_type: role,
      });

      if (response.status === 200) {
        setIsUpdateSuccess(true);
        openSnackbar("Update successful", "success");
      } else {
        setIsUpdateSuccess(false);
        openSnackbar("Update failed", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === "Email Address already exists") {
          openSnackbar("Email Address already exists", "error");
        } else if (error.response.data.error === "Username already exists") {
          openSnackbar("Username already exists", "error");
        } else {
          openSnackbar("Update failed", "error");
        }
      } else {
        console.error("Error during update:", error);
        setIsUpdateSuccess(false);
        openSnackbar("Update failed", "error");
      }
    }
  };

  const truncateFilename = (filename, maxLength) => {
    if (filename.length <= maxLength) {
      return filename;
    }

    const extension = filename.split(".").pop();
    const truncatedFilename =
      filename.substring(0, maxLength - extension.length - 4) +
      ` ... .${extension}`;
    return truncatedFilename;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <NavBar />
      <div className="bg-white pt-[10rem] mb-20">
        <h1 className="text-2xl text-center text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Information
        </h1>
        <div className="bg-white p-8 rounded w-96 shadow-2xl mt-4">
          <h2 className="text-xl font-bold mb-4 text-center text-[#444444;]">
            Edit Your Profile
          </h2>
          {profilePicture ? (
            <div className="flex justify-center items-center">
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                style={{ width: "70%", borderRadius: "50%", marginTop: "10px" }}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img
                src={default_avatar}
                alt="Profile"
                style={{
                  width: "70%",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            </div>
          )}
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
            <div className="upload-container mb-5">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                style={{ display: "none" }}
                id="profile-picture-upload"
              />
              <label htmlFor="profile-picture-upload" className="upload-button">
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
                {profilePicture ? (
                  <p className="text-[#69717a]">
                    {truncateFilename(profilePicture.name, 25)}
                  </p>
                ) : (
                  <p className="text-[#69717a]">No file selected.</p>
                )}
              </div>
            </div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
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
              onClick={handleUpdate}
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
              Update Profile
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
              severity={isUpdateSuccess ? "success" : "error"}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Information;
