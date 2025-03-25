import React from 'react';
import { FaHome, FaProductHunt, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function Adminpanel() {
    const sidebarOptions = [
        { name: 'Dashboard', icon: <FaHome />, path: '/' },
        { name: 'Products', icon: <FaProductHunt />, path: '/products' },
        { name: 'Orders', icon: <FaShoppingCart />, path: '/orders' },
        { name: 'Customers', icon: <FaUser />, path: '/customers' },
        { name: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
      ];
    
      return (
        <div className="h-screen w-64 bg-purple-600 text-white flex flex-col">
          <h1 className="text-2xl font-extrabold text-center p-4 border-b border-white">Admin Panel</h1>
          <nav className="flex flex-col mt-4">
            {sidebarOptions.map((option, index) => (
              <NavLink
                to={option.path}
                key={index}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 text-lg hover:bg-purple-800 ${
                    isActive ? 'bg-gray-700' : ''
                  }`
                }
              >
                {option.icon}
                {option.name}
              </NavLink>
            ))}
          </nav>
        </div>
      );
    };
    
    const AdminPage = () => {
      return (
        <div className="flex h-screen">
          {/* <Sidebar /> */}
          <div className="flex-1 bg-gray-100 p-6">
            {/* <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/logout" element={<Logout />} />
            </Routes> */}
          </div>
        </div>
      );
    };
    
    const Dashboard = () => <div className="text-2xl">Welcome to the Dashboard</div>;
    const Products = () => <div className="text-2xl">Manage Products</div>;
    
    // const Orders = () => {
    //   const [orders, setOrders] = useState([]);
    
    //   useEffect(() => {
    //     axios.get('https://local-swart.vercel.app/api/orders')
    //       .then(response => {
    //         setOrders(response.data);
    //         console.log(response.data);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching orders:', error);
    //       });
    //   }, []);
    
    //   return (
    //     <div>
    //       <h2 className="text-2xl mb-4">Orders</h2>
    //       <table className="table-auto w-full border-collapse border border-gray-300">
    //         <thead>
    //           <tr>
    //             <th className="border border-gray-300 px-4 py-2">Customer</th>
    //             <th className="border border-gray-300 px-4 py-2">Products</th>
    //             <th className="border border-gray-300 px-4 py-2">Total Amount</th>
    //             <th className="border border-gray-300 px-4 py-2">Order Status</th>
    //             <th className="border border-gray-300 px-4 py-2">Payment Status</th>
    //             <th className="border border-gray-300 px-4 py-2">Actions</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {orders.map(order => (
    //             <tr key={order._id}>
    //               <td className="border border-gray-300 px-4 py-2">{order.customer.name}</td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 {order.products.map(product => (
    //                   <div key={product.productId}>
    //                     {product.quantity} x {product.productId} (${product.price})
    //                   </div>
    //                 ))}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2">${order.totalAmount}</td>
    //               <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
    //               <td className="border border-gray-300 px-4 py-2">{order.paymentStatus}</td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
    //                   Update Status
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   );
    // };
    
    const Customers = () => <div className="text-2xl">Customer List</div>;
    const Logout = () => <div className="text-2xl">Logout Page</div>;
    
    const VendorAdminPanel = () => {
      return (
        <Router>
          <AdminPage />
        </Router>
      );
    };


export default Adminpanel;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
// import { FaHome, FaProductHunt, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const Sidebar = () => {
//   const sidebarOptions = [
//     { name: 'Dashboard', icon: <FaHome />, path: '/' },
//     { name: 'Products', icon: <FaProductHunt />, path: '/products' },
//     { name: 'Orders', icon: <FaShoppingCart />, path: '/orders' },
//     { name: 'Customers', icon: <FaUser />, path: '/customers' },
//     { name: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
//   ];

//   return (
//     <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
//       <h1 className="text-2xl font-bold text-center p-4 border-b border-gray-600">Vendor Panel</h1>
//       <nav className="flex flex-col mt-4">
//         {sidebarOptions.map((option, index) => (
//           <NavLink
//             to={option.path}
//             key={index}
//             className={({ isActive }) =>
//               `flex items-center gap-4 px-4 py-3 text-lg hover:bg-gray-700 ${
//                 isActive ? 'bg-gray-700' : ''
//               }`
//             }
//           >
//             {option.icon}
//             {option.name}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// const AdminPage = () => {
//   return (
//     <div className="flex h-screen">
//       <Sidebar />
//       <div className="flex-1 bg-gray-100 p-6">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/customers" element={<Customers />} />
//           <Route path="/logout" element={<Logout />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => <div className="text-2xl">Welcome to the Dashboard</div>;
// const Products = () => <div className="text-2xl">Manage Products</div>;

// const Orders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     axios.get('https://local-swart.vercel.app/api/orders/orders/orders')
//       .then(response => {
//         setOrders(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching orders:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2 className="text-2xl mb-4">Orders</h2>
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 px-4 py-2">Customer</th>
//             <th className="border border-gray-300 px-4 py-2">Products</th>
//             <th className="border border-gray-300 px-4 py-2">Total Amount</th>
//             <th className="border border-gray-300 px-4 py-2">Order Status</th>
//             <th className="border border-gray-300 px-4 py-2">Payment Status</th>
//             <th className="border border-gray-300 px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order._id}>
//               <td className="border border-gray-300 px-4 py-2">{order.customer.name}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {order.products.map(product => (
//                   <div key={product.productId}>
//                     {product.quantity} x {product.productId} (${product.price})
//                   </div>
//                 ))}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">${order.totalAmount}</td>
//               <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
//               <td className="border border-gray-300 px-4 py-2">{order.paymentStatus}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
//                   Update Status
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const Customers = () => <div className="text-2xl">Customer List</div>;
// const Logout = () => <div className="text-2xl">Logout Page</div>;

// const VendorAdminPanel = () => {
//   return (
//     <Router>
//       <AdminPage />
//     </Router>
//   );
// };

// export default VendorAdminPanel;
