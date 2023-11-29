import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./../assets/logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <nav className=" text-white p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img src={logo} className="h-12 mr-4" alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center space-x-8">
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
              <Link
                to="/signout"
                className="block px-4 py-2 hover:text-green-500"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>
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
