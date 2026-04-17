import React, { useEffect, useState } from "react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("Token");

        const res = await fetch(
          "https://local-swart.vercel.app/api/orders/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Fetched Orders:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen dark:text-white">
      <h2 className="text-xl font-semibold mb-6">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
  <div className="space-y-3">
  {orders.map((order) => (

    
    <div
      key={order._id}
      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 gap-6"
    >
      {/* ORDER ID */}
      <div className="w-1/4">

      <p className="text-sm text-gray-600 dark:text-gray-300">
          {order.user?.name || "Unknown User"}
      </p>
      
      <div className="w-1/4 text-sm text-gray-500 dark:text-gray-400">
        {order._id.slice(-8)}
      </div>
      </div>

      {/* PRODUCTS */}
      <div className="w-2/4 text-sm dark:text-white">
        {order.products.map((item, i) => (
          <div key={i}>
            {item.product?.name} × {item.quantity}
          </div>
        ))}
      </div>


      {/* TOTAL */}
      <div className="w-1/4 text-right font-semibold text-green-600">
        ₹{order.totalAmount}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
};

export default AllOrders;