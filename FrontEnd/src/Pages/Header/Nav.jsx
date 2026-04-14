import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User, ShoppingCart, MenuIcon, X } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { jwtDecode } from "jwt-decode";

const Nav = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // 🔹 Helper for NavLink styling
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold border-b-2 border-blue-500"
      : "hover:text-blue-300";

  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsTokenValid(false);
      setIsAdmin(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      const isValid = decoded.exp > currentTime;
      setIsTokenValid(isValid);
      setIsAdmin(isValid && decoded.role === "admin");
    } catch (err) {
      console.error("Invalid Token!", err);
      setIsTokenValid(false);
      setIsAdmin(false);
    }
  };

  const setCartItems = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsTokenValid(false);
      return;
    }

    try {
      const decodeToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodeToken.exp > currentTime) {
        setIsTokenValid(true);

        fetch("http://localhost:5000/order/fetch", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              if (token && decodeToken.exp > currentTime) {
                setCart(data);
              } else {
                setCart([]);
              }
            } else {
              setCart([]);
            }
          })
          .catch((err) => console.error(err));
      } else {
        setIsTokenValid(false);
      }
    } catch {
      console.log("Invalid Token");
      setIsTokenValid(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setCart([]);
    navigate("/login");
  };

  useEffect(() => {
    checkTokenValidity();
    setCartItems();
    const handleStorageChange = () => checkTokenValidity();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white text-cyan-900 font-medium shadow-md">
      {/* Logo */}
      <div className="text-2xl font-semibold poppins">
        Tech-Tronics
        <p className="text-[12px] text-end text-blue-500">
          Powering Your Digital World
        </p>
      </div>

      {/* Desktop Links */}
      <div className="hidden min-[1150px]:flex flex-1 justify-center">
        <div className="flex items-center gap-6 text-lg">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/aboutus" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contactus" className={navLinkClass}>
            Contact Us
          </NavLink>
          {isAdmin && (
            <NavLink to="/salesorder" className={navLinkClass}>
              Sales Order
            </NavLink>
          )}
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden min-[1150px]:flex items-center gap-5">
        <NavLink to="/addtocart" className={navLinkClass}>
          <div className="relative">
            <span className="absolute -top-2 -right-2 px-1 text-xs text-white bg-red-600 rounded-full">
              {cart.length}
            </span>
            <ShoppingCart className="hover:text-blue-300 cursor-pointer" />
          </div>
        </NavLink>

        {!isTokenValid ? (
          <NavLink to="/login" className={navLinkClass}>
            <User className="hover:text-blue-300 cursor-pointer" />
          </NavLink>
        ) : (
          <button
            onClick={logOut}
            className="px-3 py-1 cursor-pointer rounded-md bg-red-500 text-white hover:bg-red-600 font-medium"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex min-[1150px]:hidden cursor-pointer"
      >
        {menuOpen ? <X size={32} /> : <MenuIcon size={32} />}
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-16 border-t left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out min-[1150px]:hidden 
          ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center py-6 gap-4 text-lg">
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/aboutus" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/contactus" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Contact Us
          </NavLink>
          {isAdmin && (
            <NavLink to="/salesorder" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Sales Order
            </NavLink>
          )}

          {/* Cart + Auth inside menu */}
          <NavLink to="/addtocart" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <div className="relative flex items-center">
              <ShoppingCart className="mr-2" />
              <span className="absolute -top-2 -right-2 px-1 text-xs bg-red-600 rounded-full">
                {cart.length}
              </span>
            </div>
          </NavLink>

          {!isTokenValid ? (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>
              <button className="px-4 py-2 rounded-lg cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
                Login
              </button>
            </NavLink>
          ) : (
            <button
              onClick={() => {
                logOut();
                setMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg cursor-pointer duration-100 ease-in-out bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
