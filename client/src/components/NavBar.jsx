import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./../assets/logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CryptoJS from "crypto-js";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") ?? "";
  const isTokenAvailable = !!localStorage.getItem("token");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_type = localStorage.getItem("decodedTokenUserType") ?? "";
  const decryptedUserType = CryptoJS.AES.decrypt(user_type, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const decryptedtoken = CryptoJS.AES.decrypt(token, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );

  const handleMouseEnter = () => {
    setTimeout(() => {
      setDropdownOpen(true);
    }, 200);
  };

  const handleMouseLeave = (event) => {
    const dropdownContainer = document.querySelector(".dropdown-content");
    const isLeavingDropdown = dropdownContainer !== event.relatedTarget;

    if (isLeavingDropdown) {
      setDropdownOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("decodedTokenId");
    localStorage.removeItem("decodedTokenEmail");
    localStorage.removeItem("decodedTokenUserType");
    localStorage.removeItem("decodedTokenUsername");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    navigate("/login");
    setSnackbarOpen(false);
  };

  const decodeToken = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/decode_token",
        { token }
      );

      if (!!response.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Decode Token Error:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      if (!decryptedtoken) {
        navigate("/login");
      }
      decodeToken(decryptedtoken).then((tokenStatus) => {
        if (tokenStatus === false) {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <nav className=" text-white p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img src={logo} className="h-12 mr-4" alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isTokenAvailable && decryptedtoken ? (
            decryptedUserType === "seller" ? (
              <>
                <NavLink to="/" exact>
                  Home
                </NavLink>
                <NavLink to="/store">Store</NavLink>
                <NavLink to="/orders">Orders</NavLink>

                <div className="relative group" onMouseEnter={handleMouseEnter}>
                  <p className="block px-4 py-2 hover:text-green-500 cursor-pointer text-xl font-bold text-[#7A7A7A]">
                    Profile
                    <ExpandMoreIcon />{" "}
                  </p>

                  <div
                    className={`${
                      isDropdownOpen ? "block" : "hidden"
                    } absolute right-0 mt-2 space-y-2 bg-white text-[19px] font-bold text-[#7A7A7A] transition-transform duration-300 ease-in-out transform translate-y-2 shadow-md`}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/information"
                      className="block px-4 py-2 hover:text-green-500"
                    >
                      Information
                    </Link>
                    <p
                      className="block px-4 py-2 hover:text-green-500 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Log out
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/" exact>
                  Home
                </NavLink>
                <NavLink to="/orders">Orders</NavLink>

                <div className="relative group" onMouseEnter={handleMouseEnter}>
                  <p className="block px-4 py-2 hover:text-green-500 cursor-pointer text-xl font-bold text-[#7A7A7A]">
                    Profile
                    <ExpandMoreIcon />{" "}
                  </p>

                  <div
                    className={`${
                      isDropdownOpen ? "block" : "hidden"
                    } absolute right-0 mt-2 space-y-2 bg-white text-[19px] font-bold text-[#7A7A7A] transition-transform duration-300 ease-in-out transform translate-y-2 shadow-md`}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/information"
                      className="block px-4 py-2 hover:text-green-500"
                    >
                      Information
                    </Link>
                    <p
                      className="block px-4 py-2 hover:text-green-500 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Log out
                    </p>
                  </div>
                </div>
              </>
            )
          ) : (
            <>
              <NavLink to="/" exact>
                Home
              </NavLink>

              <div className="relative group" onMouseEnter={handleMouseEnter}>
                <p className="block px-4 py-2 hover:text-green-500 cursor-pointer text-xl font-bold text-[#7A7A7A]">
                  Profile
                  <ExpandMoreIcon />{" "}
                </p>

                <div
                  className={`${
                    isDropdownOpen ? "block" : "hidden"
                  } absolute right-0 mt-2 space-y-2 bg-white text-[19px] font-bold text-[#7A7A7A] transition-transform duration-300 ease-in-out transform translate-y-2 shadow-md`}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:text-green-500"
                  >
                    Login in
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "5rem",
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Logout successful
        </MuiAlert>
      </Snackbar>
    </nav>
  );
};

const NavLink = ({ to, exact, children }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`hover:text-green-500 ${
        isActive ? "text-green-500 font-bold" : "text-[#7A7A7A]"
      } text-[19px] font-bold`}
    >
      {children}
    </Link>
  );
};

export default NavBar;
