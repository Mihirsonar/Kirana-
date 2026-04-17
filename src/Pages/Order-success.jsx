import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border dark:border-gray-800">

        {/* SUCCESS ICON */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-3xl text-green-600">✓</span>
          </div>

          <h2 className="text-2xl font-semibold dark:text-white">
            Order Placed Successfully!
          </h2>

          <p className="text-gray-500 mt-1">
            Your order has been confirmed 🎉
          </p>
        </div>
{/* 
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium dark:text-white">
              #{order._id.slice(-6)}
            </span>
          </div>

          <div className="border-t my-2" />

          <div>
            <p className="font-medium mb-2 dark:text-white">Items</p>

            {order.products?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span>
                  {item.product?.name || "Item"} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t my-2" />

          <div className="flex justify-between font-semibold text-lg">
            <span className="dark:text-white">Total</span>
            <span className="text-green-600">₹{order.totalAmount}</span>
          </div>
        </div> */}

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-[50%] py-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="w-[50%] py-2 rounded-lg bg-green-600 text-white"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;