import React from 'react'
import Carousel from '../Components/Carousel'
import Products from '../Components/Products'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
function Home() {

  const darkMode = useSelector((state) => state.theme.darkMode);

useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
}, [darkMode]);

  return (
  <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">

<Carousel/> 
<Products/> 
    </div>
)
}

export default Home