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

        {/* PUSH NOTIFICATION OPT-IN */}
        {typeof window !== "undefined" && "Notification" in window && Notification.permission === "default" && (
          <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl">
            <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-blue-900 dark:text-blue-300">
              <span>🔔</span>
              <span>Get Live Delivery Alerts</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
              Enable notifications to receive real-time updates when your order is packed and out for delivery.
            </p>
            <button
              onClick={async (e) => {
                const btn = e.currentTarget;
                btn.disabled = true;
                btn.textContent = "Enabling...";
                try {
                  const token = localStorage.getItem("Token");
                  const { subscribeUserToPush } = await import("../utils/pushNotifications");
                  await subscribeUserToPush(token);
                  btn.textContent = "✓ Alerts Enabled!";
                  btn.className = "text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white";
                } catch (err) {
                  btn.textContent = "Unable to Enable";
                  btn.disabled = false;
                }
              }}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Turn On Notifications
            </button>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-[50%] py-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/myorders")}
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