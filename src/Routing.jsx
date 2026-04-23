import React,{Suspense,lazy}from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Cart from './Pages/Cart';
import LoginPage from './Pages/Login';
import SignInPage from './Pages/Register';
// import Adminpanel from './Pages/Vender/Vender.Adminpanel';
import Orders from './Pages/Orders';
import AddressPage from './Pages/Address';
import PaymentPage from './Pages/Payment';
import ProtectedRoute from './Components/ProtectedRoute';
// import AllOrders from './Pages/Admin/AllOrders';
import AdminRoute from './Components/AdminRoute';
import Profile from './Pages/Profile';
import OrderSuccess from './Pages/Order-success';
import MyOrders from './Pages/Myorders';

const AllOrdersLazy = lazy(() => import('./Pages/Admin/AllOrders'));

function Routing() {
  const location = useLocation();

  const hideHeaderFooterPaths = ['/login', '/register', '/adminpanel', '/cart', '/orders', '/address','/payment','/order-success'];

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
        <Route path='/profile' element={<Profile />} />
        <Route path='/order-success' element={<OrderSuccess />} />
        {/* <Route path='/adminpanel/*' element={<Adminpanel />} /> */}
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
          path='/myorders'
          element={
       <ProtectedRoute>
         <MyOrders />
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
        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/AllOrders"
  element={
    <AdminRoute>
      <Suspense fallback={<div>Loading...</div>}>
      <AllOrdersLazy />
      </Suspense>
    </AdminRoute>
  }
/>


      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;
