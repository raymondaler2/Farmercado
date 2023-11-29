import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./../assets/logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const NavBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

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
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    navigate("/login");
    setSnackbarOpen(false);
  };

  const isTokenAvailable = !!localStorage.getItem("token");

  return (
    <nav className=" text-white p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img src={logo} className="h-12 mr-4" alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center space-x-8">
          {isTokenAvailable ? (
            <>
              <NavLink to="/" exact>
                Home
              </NavLink>
              <NavLink to="/prices">Prices</NavLink>
              <NavLink to="/store">Store</NavLink>
              <NavLink to="/orders">Orders</NavLink>

              <div className="relative group" onMouseEnter={handleMouseEnter}>
                <NavLink to="/profile">
                  Profile
                  <ExpandMoreIcon />{" "}
                </NavLink>

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
                    Sign out
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" exact>
                Home
              </NavLink>

              <div className="relative group" onMouseEnter={handleMouseEnter}>
                <NavLink to="/profile">
                  Profile
                  <ExpandMoreIcon />{" "}
                </NavLink>

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
