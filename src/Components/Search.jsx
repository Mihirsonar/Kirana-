import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../redux/Slice/ProductSlice';
import { CiSearch } from "react-icons/ci";


const SearchBar = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setInput(value);
    dispatch(setSearchQuery(value)); // Update Redux state
  };

  return (
    <div className="flex items-center border border-gray-200 bg-gray-50 hover:bg-gray-100/70 focus-within:bg-white focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-purple-100/80 rounded-xl overflow-hidden w-full h-10 transition-all shadow-sm">
      <CiSearch className="ml-3.5 text-gray-400 w-5 h-5 shrink-0" />
      <input
        type="text"
        placeholder="Search for products, brands and more..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-grow px-3 bg-transparent focus:outline-none text-gray-800 text-sm placeholder:text-gray-400 font-normal"
      />
      {input && (
        <button
          type="button"
          onClick={() => handleChange('')}
          className="mr-3 text-gray-400 hover:text-gray-600 text-xs font-semibold p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
