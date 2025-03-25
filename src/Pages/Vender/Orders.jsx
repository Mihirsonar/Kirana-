import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

    const Orders = () => {
        const [orders, setOrders] = useState([]);
      
        useEffect(() => {
          axios.get('https://local-swart.vercel.app/api/orders/orders')
            .then(response => {
              setOrders(response.data);
              console.log('response');
            })
            .catch(error => {
              console.error('Error fetching orders:', error);
            });
        }, []);
      
        return (
          <div>
            <h2 className="text-2xl mb-4">Orders</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Customer</th>
                  <th className="border border-gray-300 px-4 py-2">Products</th>
                  <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Order Status</th>
                  <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="border border-gray-300 px-4 py-2">{order.customer.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.products.map(product => (
                        <div key={product.productId}>
                          {product.quantity} x {product.productId} (${product.price})
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">${order.totalAmount}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.paymentStatus}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };
      

export default Orders