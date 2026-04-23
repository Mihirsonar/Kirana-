import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("Token");

      const { data } = await axios.get(
        "https://local-swart.vercel.app/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        My Orders 
      </h1>

      {orders.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No orders yet 🛒
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toDateString()}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {order.products?.slice(0, 4).map((item, i) => (
                  <div key={i} className="min-w-[60px]">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {order.products?.length} items
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    View
                  </button>

                  <button className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;