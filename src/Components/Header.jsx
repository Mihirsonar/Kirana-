import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PiShoppingCartThin } from "react-icons/pi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { LiaCartPlusSolid } from "react-icons/lia";
import { toggleTheme } from "../redux/Slice/ThemeSlice";
import SearchBar from "./Search";

function Header() {
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const darkMode = useSelector((state) => state.theme.darkmode);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCount = cartItems.length;

useEffect(() => {
  const token = localStorage.getItem("Token");
  const rawUser = localStorage.getItem("User");

  let user = {};

  try {
    user = JSON.parse(rawUser);
  } catch {
    user = { name: rawUser };
  }

  setIsLoggedIn(!!token);
  if (user?.name) setUserName(user.name);
}, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 dark:text-white">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 w-full">
          <Link
            to="/"
            className="flex items-center text-xl font-bold tracking-tight dark:text-white text-gray-900"
          >
            Kirana
            <LiaCartPlusSolid className="ml-1 w-5 h-5" />
          </Link>

          <div className="hidden md:block w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>

          <Link to="/cart" className="relative">
            <PiShoppingCartThin className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-2 font-medium"
              >
                <IoPersonCircleOutline className="w-6 h-6" />
                {userName.split(" ")[0]}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("Token");
                      localStorage.removeItem("User");
                      setIsLoggedIn(false);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                Login
              </button>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-2xl"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden px-6 pb-4 transition-all duration-300 ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <SearchBar />
        <div className="flex flex-col gap-4 mt-4 font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;