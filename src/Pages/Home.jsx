import React from 'react'
import Carousel from '../Components/Carousel'
import Products from '../Components/Products'
import { useSelector } from 'react-redux';

function Home() {
  const darkMode = useSelector((state) => state.theme.darkmode);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">

<Carousel/> 
<Products/> 
    </div>
)
}

export default Home