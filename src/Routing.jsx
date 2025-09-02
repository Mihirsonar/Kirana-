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
import AddressPage from './Pages/Address';
import PaymentPage from './Pages/Payment';

function Routing() {
  const location = useLocation();

  const hideHeaderFooterPaths = ['/login', '/register', '/adminpanel', '/cart', '/orders', '/address','/payment'];

  const shouldHideHeaderFooter = hideHeaderFooterPaths.some(path =>
    location.pathname.startsWith(path)
  );

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
        <Route path='/adminpanel/*' element={<Adminpanel />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/address' element={<AddressPage />} />
        <Route path='/payment' element={<PaymentPage />} />


      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;
