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
import ProtectedRoute from './Components/ProtectedRoute';

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
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<SignInPage />} />
        <Route path='/adminpanel/*' element={<Adminpanel />} />
        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
         <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
         <Route
          path='/address'
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />  

                 <Route
          path='/payment'
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        /> 

      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;
