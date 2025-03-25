import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Cart from './Pages/Cart';
import LoginPage from './Pages/Login';
import SignInPage from './Pages/Register';
import Adminpanel from './Pages/Vender/Vender.Adminpanel';
import Orders from './Pages/Vender/Orders';

function Routing() {
  const location = useLocation();

  // Define paths where Header and Footer should not be displayed
  const hideHeaderFooterPaths = ['/', '/register','/adminpanel','/cart'];

  const shouldHideHeaderFooter = hideHeaderFooterPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<SignInPage />} />
        <Route path='/adminpanel' element={<Adminpanel />} />
        <Route path='/orders' element={<Orders />} />

      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;
