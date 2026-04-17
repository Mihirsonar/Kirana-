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
        if (!res.ok) throw new Error(data.message);

        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-800 dark:text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <span className="text-sm text-gray-500">
          {orders.length} total
        </span>
      </div>

      {/* ORDERS */}
      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* TOP SECTION */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>

                <span className="text-lg font-semibold text-green-600">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            {/* USER + ADDRESS */}
            <div className="mb-4">
              <p className="text-sm font-medium">
                {order.user?.name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                {order.address?.street}, {order.address?.city} -{" "}
                {order.address?.zip}
              </p>
            </div>

            {/* PRODUCT TABLE */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">

              {/* HEADER */}
              <div className="grid grid-cols-[1.2fr_2fr_0.6fr] px-3 py-2 text-xs font-semibold text-gray-500 border-b dark:border-gray-700">
                <span>Product ID</span>
                <span>Name</span>
                <span className="text-right">Qty</span>
              </div>

              {/* ITEMS */}
              <div className="divide-y dark:divide-gray-700">
                {order.products?.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.2fr_2fr_0.6fr] px-3 py-2 text-sm items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span className="font-mono text-gray-500 truncate">
                      {item.product?._id?.slice(-6)}
                    </span>

                    <span className="truncate dark:text-white">
                      {item.product?.name}
                    </span>

                    <span className="text-right font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300">
                View
              </button>

              <select
                className="text-sm px-3 py-1 rounded-md border dark:bg-gray-800"
                defaultValue={order.status}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No orders found
        </div>
      )}
    </div>
  );
};

export default AllOrders;