import React from "react";

function Profile() {
  const rawUser = localStorage.getItem("User");

  let user = {};
  try {
    user = JSON.parse(rawUser);
  } catch {
    user = { name: rawUser };
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">
        My Profile
      </h2>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          Name: {user?.name || "N/A"}
        </p>

        {user?.addresses?.length > 0 ? (
          <div className="mt-4 space-y-3">
            {user.addresses.map((addr, i) => (
              <div key={i} className="p-3 border rounded-lg dark:border-gray-700">
                <p>{addr.label}</p>
                <p>{addr.street}, {addr.city}</p>
                <p>ZIP: {addr.zip}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-3">No addresses found</p>
        )}
      </div>
    </div>
  );
}

export default Profile;