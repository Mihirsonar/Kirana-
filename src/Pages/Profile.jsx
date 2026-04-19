import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, LogOut } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("User");

  let user = {};
  try {
    user = JSON.parse(rawUser);
  } catch {
    user = { name: rawUser };
  }

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        My Profile
      </h2>

      {/* USER CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-5">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {user?.name || "User"}
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-5 divide-y dark:divide-gray-800">

        <div
          onClick={() => navigate("/myorders")}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-3">
            <Package size={18} />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              My Orders
            </span>
          </div>
          <span>›</span>
        </div>

        <div
          onClick={() => navigate("/addresses")}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-3">
            <MapPin size={18} />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              Saved Addresses
            </span>
          </div>
          <span>›</span>
        </div>
      </div>

      {/* ADDRESS LIST */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-5">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Your Addresses
        </h3>

        {user?.addresses?.length > 0 ? (
          <div className="space-y-3">
            {user.addresses.map((addr, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {addr.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ZIP: {addr.zip}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No addresses found
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default Profile;