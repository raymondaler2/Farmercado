import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import NavBar from "./../components/NavBar.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <NavBar />
      <div className="bg-white">
        <h1 className="text-2xl text-center text-[#8BC34A] text-[5rem] mb-11 font-serif">
          Login
        </h1>
        <div className="bg-white p-8 rounded w-96 shadow-2xl mt-4">
          <h2 className="text-xl font-bold mb-4 text-center text-[#444444;]">
            Sign in to Your Account
          </h2>
          <form>
            <div className="mb-4">
              <TextField
                fullWidth
                id="username"
                label="Username"
                variant="outlined"
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
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
                control={<Checkbox color="primary" />}
                label="Remember Me"
                style={{ color: "#444", fontWeight: "bold" }}
              />
            </div>

            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
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
        <div className="text-center mt-16 text-[#69717a]">
          <p>
            <Link to="/register" className="hover:underline">
              Register
            </Link>{" "}
            |{" "}
            <Link to="/lost-password" className="hover:underline">
              Lost your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
