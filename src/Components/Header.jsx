import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PiShoppingCartThin } from "react-icons/pi";
import { IoPersonCircleOutline, IoLocationOutline, IoChevronDownOutline } from "react-icons/io5";
import { FiSun, FiMoon } from "react-icons/fi";
import { toggleTheme } from "../redux/Slice/ThemeSlice";
import SearchBar from "./Search";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCount = cartItems.length;
  const isDarkMode = useSelector((state) => state.theme.darkmode);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // ── Load auth + address ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const rawUser = localStorage.getItem("User");
    let user = {};
    try { user = JSON.parse(rawUser); } catch { user = { name: rawUser }; }
    setIsLoggedIn(!!token);
    if (user?.name) setUserName(user.name);

    const savedAddr = localStorage.getItem("selectedAddress");
    if (savedAddr) {
      try { setSelectedAddress(JSON.parse(savedAddr)); } catch { }
    }

    if (token) {
      fetch(`${BASE_URL}/api/auth/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.addresses?.length) {
            const def = data.defaultAddress
              ? data.addresses.find((a) => String(a._id) === String(data.defaultAddress))
              : data.addresses[0];
            if (def) {
              setSelectedAddress(def);
              localStorage.setItem("selectedAddress", JSON.stringify(def));
            }
          }
        })
        .catch(() => { });
    }
  }, []);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("selectedAddress");
    if ("caches" in window) {
      try {
        caches.keys().then((keys) => {
          keys.filter((k) => k.includes("api")).forEach((k) => caches.delete(k));
        });
      } catch (e) { }
    }
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ══ Main Header ═══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── LEFT: Logo & Delivery Address ──────────────────────────── */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link
              to="/"
              className="text-2xl font-black tracking-tight text-gray-900 dark:text-white select-none flex items-center"
            >
              Kirana<span className="text-purple-600 dark:text-purple-400">+</span>
            </Link>

            {/* Deliver-to Address */}
            <button
              onClick={() => navigate(isLoggedIn ? "/address" : "/login")}
              className="hidden md:flex flex-col items-start px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left group"
              title="Change Delivery Address"
            >
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                <IoLocationOutline className="w-3.5 h-3.5 shrink-0" />
                {selectedAddress ? `Deliver to ${selectedAddress.label}` : "Deliver to"}
                <IoChevronDownOutline className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </span>
              <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-tight max-w-[160px] lg:max-w-[200px] truncate mt-0.5">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}`
                  : "Select Address"}
              </span>
            </button>
          </div>

          {/* ── CENTER: Modern Search Bar ──────────────────────────────── */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* ── RIGHT: Nav Links + Theme Toggle + Account + Cart + Mobile Hamburger ───── */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle (Quick Sun/Moon) */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200/80 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition border border-gray-200 dark:border-gray-700 flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <FiSun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <FiMoon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* User Account / Login */}
            {isLoggedIn ? (
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 transition"
                >
                  <IoPersonCircleOutline className="w-5 h-5 text-gray-600 dark:text-gray-300 shrink-0" />
                  <span className="hidden sm:inline font-medium capitalize max-w-[100px] truncate">
                    {userName.split(" ")[0]}
                  </span>
                  <IoChevronDownOutline className="w-3 h-3 text-gray-500 dark:text-gray-400 shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-medium"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/address"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-medium"
                    >
                      My Addresses
                    </Link>
                    <Link
                      to="/myorders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-medium"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-medium"
                    >
                      Settings & Theme
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium border-t border-gray-100 dark:border-gray-700 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-semibold"
                  title="Settings"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-sm"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/80 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition shrink-0 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <PiShoppingCartThin className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ══ Mobile Dropdown ═══════════════════════════════════════════════ */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-3">
          <SearchBar />
          {/* Mobile address */}
          <button
            onClick={() => {
              navigate(isLoggedIn ? "/address" : "/login");
              setMobileOpen(false);
            }}
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold text-left p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40"
          >
            <IoLocationOutline className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {selectedAddress
                ? `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}`
                : "Set delivery address"}
            </span>
          </button>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 flex items-center justify-between"
            >
              <span>Settings & Theme</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {isDarkMode ? "Dark" : "Light"}
              </span>
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
