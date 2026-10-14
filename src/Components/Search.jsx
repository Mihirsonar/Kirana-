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
    <div className="flex items-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 hover:bg-gray-100/70 dark:hover:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:border-gray-300 dark:focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-purple-100/80 dark:focus-within:ring-purple-900/40 rounded-xl overflow-hidden w-full h-10 transition-all shadow-sm">
      <CiSearch className="ml-3.5 text-gray-400 dark:text-gray-400 w-5 h-5 shrink-0" />
      <input
        type="text"
        placeholder="Search for products, brands and more..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-grow px-3 bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 font-normal"
      />
      {input && (
        <button
          type="button"
          onClick={() => handleChange('')}
          className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
