import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LiaCartPlusSolid } from "react-icons/lia";
import { PiShoppingCartThin } from "react-icons/pi";
import { BsShop } from "react-icons/bs";
import SearchBar from './Search';
import { IoPersonCircleOutline } from "react-icons/io5";
// import ShinyText from './Button';
import GradientText from './Button';

function Header() {
  const [MobileView, setMobileView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const toggler = () => {
    setMobileView(!MobileView);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("Token"));
    const user = JSON.parse(localStorage.getItem("User"));
    setIsLoggedIn(!!token);
    if (user) setUserName(user);
  }, []);

  const cartItems = useSelector((state) => state.Cart.cartItems || []);
  const cartCount = cartItems.length;

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Cart', path: '/cart' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
  ];

  return (
    <div className="flex sticky mx-5 top-0 z-50 p-3 px-8 bg-[#102E4A] text-white rounded-xl mt-1 mb-2">
      {/* Left Section */}
      <div className="flex items-center gap-6 w-full">
        <Link to="/home" className="flex items-center text-2xl font-bold ">
          Kirana <LiaCartPlusSolid className="ml-1 mt-1 w-6 h-6 " />
        </Link>
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className=" lg:flex  sm:hidden items-center gap-6">
        {/* User Name and Dropdown */}
        {isLoggedIn ? (
          <div className="relative group">
            <button className="flex items-center justify-center mx-3 p-2 font-semibold text-white rounded-lg gap-1">
            <IoPersonCircleOutline className="ml-1 w-6 h-6" />
              {userName.split(" ")[0]}

              {/* <ShinyText text= {userName.split(" ")[0]} disabled={false} speed={2} className='custom-class  p-2 px-2 rounded-full' /> */}

              
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg hidden group-hover:flex flex-col">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-black font-semibold"
              >
                Profile
              </Link>
              <Link to="/">
              <button
                onClick={() => {
                  localStorage.removeItem("Token");
                  localStorage.removeItem("User");
                  setIsLoggedIn(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black font-semibold"
              >
                Logout
              </button>
              </Link>

            </div>
          </div>
        ) : (
          <Link to="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Login
            </button>
          </Link>
        )}

        {/* Cart Links */}
        <div className="flex items-center gap-1 relative">
          <Link to={"/cart"}>
            <PiShoppingCartThin className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -left-2 bg-red-500 text-white text-sm font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Become Seller Button */}
        <div className="flex flex-grow-10 items-center cursor-pointer text-sm font-semibold py-2 w-36 ">
          {/* <BsShop className="w-9 h-6 mr-2" /> */}
          <GradientText
          colors={["#32292F", "#4079ff", "#32292F", "#4079ff", "#32292F"]}
          animationSpeed={2}
          showBorder={true}
          className="custom-class p-2"
          >
Become Seller</GradientText>
          {/* <ShinyText text="Become Seller" disabled={false} speed={2} className='custom-class border border-black p-2 px-2 rounded-xl' /> */}
          </div>
      </div>

      {/* Hamburger Icon for Mobile View */}
      <div className="lg:hidden flex items-center ml-3">
        <button onClick={toggler} className="text-2xl font-bold ">
          {MobileView ? 'X' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-20 left-0 w-full text-white flex flex-col gap-4 p-6 text-lg font-bold transform transition-transform duration-300 ease-in-out rounded-xl bg-[#102E4A] ${
          MobileView ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={toggler}
            className="hover:text-purple-500"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
