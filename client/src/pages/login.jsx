import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import NavBar from "./../components/NavBar.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import CryptoJS from "crypto-js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const token = localStorage.getItem("token") ?? "";
  const decryptedtoken = CryptoJS.AES.decrypt(token, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (snackbarSeverity === "success") {
      navigate("/");
    }

    setIsSnackbarOpen(false);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      const encryptedToken = CryptoJS.AES.encrypt(token, jwtSecret).toString();
      localStorage.setItem("token", encryptedToken);

      if (rememberMe) {
        const encryptedUsername = CryptoJS.AES.encrypt(
          username,
          jwtSecret
        ).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          jwtSecret
        ).toString();

        localStorage.setItem("rememberedUsername", encryptedUsername);
        localStorage.setItem("rememberedPassword", encryptedPassword);
        localStorage.setItem(
          "rememberedRememberMe",
          JSON.stringify(rememberMe)
        );
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem(
          "rememberedRememberMe",
          JSON.stringify(rememberMe)
        );
      }

      setSnackbarSeverity("success");
      setSnackbarMessage("Login successful");
      setIsSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Login failed. Invalid username or password");
      setIsSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (!!decryptedtoken) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    const rememberedRememberMe = localStorage.getItem("rememberedRememberMe");

    if (rememberedUsername) {
      const decryptedUsername = CryptoJS.AES.decrypt(
        rememberedUsername,
        jwtSecret
      ).toString(CryptoJS.enc.Utf8);
      setUsername(decryptedUsername);
    }

    if (rememberedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        rememberedPassword,
        jwtSecret
      ).toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }

    if (rememberedRememberMe) {
      setRememberMe(JSON.parse(rememberedRememberMe));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <NavBar />
      <div className="bg-white">
        <h1 className="text-2xl text-center text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Login
        </h1>
        <div className="bg-white p-8 rounded w-96 shadow-2xl mt-4">
          <h2 className="text-xl font-bold mb-4 text-center text-[#444444;]">
            Login in to Your Account
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <TextField
                fullWidth
                id="username"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </div>
            <div className="mb-4">
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                }
                label="Remember Me"
                style={{ color: "#444", fontWeight: "bold" }}
              />
            </div>

            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
                style={{
                  backgroundColor: "#8BC34A",
                  textTransform: "none",
                  padding: "20px 10px 20px 10px",
                  fontSize: "16px",
                  fontWeight: "Bold",
                }}
              >
                Log In
              </Button>
            </div>
          </form>
        </div>
        <div className="text-center mt-8 text-[#69717a]">
          <p>
            <Link to="/register" className="hover:underline">
              Register
            </Link>{" "}
            |{" "}
            <Link to="/Lost" className="hover:underline">
              Lost your password?
            </Link>
          </p>
        </div>
      </div>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "5rem",
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
