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
import CryptoJS from "crypto-js";

const Information = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_id = localStorage.getItem("decodedTokenId") ?? "";
  const decryptedUserId = CryptoJS.AES.decrypt(user_id, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );

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
    const fields = [firstName, lastName, email, password];

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

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSnackbarSeverity("error");
      openSnackbar("Invalid email address");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${decryptedUserId}`,
        {
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
          user_type: role,
          profile_picture: profilePicture
            ? await convertFileToBase64(profilePicture)
            : null,
        }
      );

      if (response.status === 200) {
        setIsUpdateSuccess(true);
        setSnackbarSeverity("success");
        openSnackbar("Update successful", "success");
      } else {
        setIsUpdateSuccess(false);
        setSnackbarSeverity("error");
        openSnackbar("Update failed", "error");
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
          openSnackbar("Update failed", "error");
        }
      } else {
        console.error("Error during update:", error);
        setIsUpdateSuccess(false);
        setSnackbarSeverity("error");
        openSnackbar("Update failed", "error");
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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

  const FetchUserData = async () => {
    try {
      const user = await axios.get(
        `http://localhost:5000/api/user/${decryptedUserId}`
      );

      setFirstName(user.data.first_name);
      setLastName(user.data.last_name);
      setUsername(user.data.username);
      setEmail(user.data.email);
      setRole(user.data.user_type);
      setProfilePicture(user.data.profile_picture);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchUserData();
  }, []);

  useEffect(() => {
    if (isUpdateSuccess) {
      window.location.reload();
    }
  }, [isUpdateSuccess]);

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
          {!profilePicture ? (
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
          ) : (
            <div className="flex justify-center items-center">
              <img
                src={`data:image/png;base64,${profilePicture}`}
                alt="Profile"
                style={{ width: "70%", borderRadius: "50%", marginTop: "10px" }}
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
              disabled={true}
              variant="outlined"
            />
            <TextField
              label="Update Email Address"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => handleInputChange(setEmail, e.target.value)}
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
                    {truncateFilename(
                      profilePicture.name ?? "No file selected.",
                      25
                    )}
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
              severity={snackbarSeverity}
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
