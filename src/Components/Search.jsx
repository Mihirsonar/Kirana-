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
    <div className="flex items-center border border-gray-700 rounded-2xl overflow-hidden w-full max-w-md h-11 bg-white">
      <CiSearch className='ml-5 text-lg'/>
      <input
        type="text"
        placeholder="Search products and brands across shops"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-grow px-3 focus:outline-none text-black"
      />
    </div>
  );
};

export default SearchBar;
