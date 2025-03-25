import React from 'react'
import Orders from './Orders';

function VenderRoutes() {
  return (
    <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/products" element={<Products />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/logout" element={<Logout />} />
  </Routes>
  )
}

export default VenderRoutes;