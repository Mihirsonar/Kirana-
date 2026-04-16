import React, { useEffect, useState } from "react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("Token"));

        const res = await fetch(
          "https://local-swart.vercel.app/api/orders/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

if (!res.ok) {
  throw new Error(data.message || "Failed to fetch orders");
}
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        All Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <p className="text-xs text-gray-400 mb-1">
                Order ID: {order._id.slice(-6)}
              </p>

              <p className="text-sm text-gray-500">
                {order.user?.name} ({order.user?.email})
              </p>

              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mt-2 space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;