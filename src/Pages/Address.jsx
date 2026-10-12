import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CartHeader from "../Components/CartHeader";
import "react-toastify/dist/ReactToastify.css";

const AddressPage = () => {
  const navigate = useNavigate();
  const BASE_URL  = import.meta.env.VITE_APP_BACKEND_URL;
  const token     = localStorage.getItem("Token");

  const [addresses, setAddresses]   = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", zip: "", label: "Home" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading]       = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const syncToBackend = async (updatedList, defaultIdx = null) => {
    const defaultId = defaultIdx !== null ? updatedList[defaultIdx]?._id : null;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/addresses`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ addresses: updatedList, defaultAddressId: defaultId }),
      });
      const data = await res.json();
      // Use server-assigned _ids
      if (data.addresses) {
        setAddresses(data.addresses);
        localStorage.setItem("addresses", JSON.stringify(data.addresses));
        const selAddr = defaultIdx !== null ? data.addresses[defaultIdx] : data.addresses[0];
        if (selAddr) localStorage.setItem("selectedAddress", JSON.stringify(selAddr));
      }
    } catch {
      toast.error("Failed to sync with server", { style: { width: "260px" } });
    }
  };

  // ── Load from backend on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    fetch(`${BASE_URL}/api/auth/addresses`, { headers: authHeaders })
      .then((r) => r.json())
      .then((data) => {
        if (data.addresses?.length) {
          setAddresses(data.addresses);
          localStorage.setItem("addresses", JSON.stringify(data.addresses));
          // Pre-select the default/first
          const defIdx = data.defaultAddress
            ? data.addresses.findIndex((a) => String(a._id) === String(data.defaultAddress))
            : 0;
          setSelectedIndex(defIdx >= 0 ? defIdx : 0);
          localStorage.setItem("selectedAddress", JSON.stringify(data.addresses[defIdx >= 0 ? defIdx : 0]));
        } else {
          // Fallback: load from localStorage
          const saved = localStorage.getItem("addresses");
          if (saved) setAddresses(JSON.parse(saved));
        }
      })
      .catch(() => {
        const saved = localStorage.getItem("addresses");
        if (saved) setAddresses(JSON.parse(saved));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      return toast.error("Fill all fields", { style: { width: "260px" } });
    }

    let updatedList;
    if (editingIndex !== null) {
      updatedList = [...addresses];
      updatedList[editingIndex] = { ...updatedList[editingIndex], ...newAddress };
      setAddresses(updatedList);
      setEditingIndex(null);
      toast.success("Address updated", { style: { width: "260px" } });
    } else {
      updatedList = [...addresses, newAddress];
      setAddresses(updatedList);
      toast.success("Address added", { style: { width: "260px" } });
    }

    setNewAddress({ street: "", city: "", zip: "", label: "Home" });
    await syncToBackend(updatedList, selectedIndex);
  };

  const handleEditAddress = (index) => {
    setNewAddress(addresses[index]);
    setEditingIndex(index);
  };

  const handleDeleteAddress = async (index) => {
    const updatedList = addresses.filter((_, i) => i !== index);
    setAddresses(updatedList);
    const newSelIdx = selectedIndex === index ? (updatedList.length ? 0 : null) : selectedIndex;
    setSelectedIndex(newSelIdx);
    toast.info("Address removed", { style: { width: "260px" } });
    await syncToBackend(updatedList, newSelIdx);
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedAddress", JSON.stringify(addresses[index]));
  };

  const handleContinue = () => {
    if (selectedIndex === null) {
      return toast.error("Select address first", { style: { width: "260px" } });
    }
    navigate("/payment");
  };


  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        toastStyle={{ width: "260px", borderRadius: "10px" }}
      />

      <CartHeader currentStep="Address" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Address
            </h2>

            {addresses.length === 0 && (
              <p className="text-gray-500">No addresses added</p>
            )}

            {addresses.map((address, index) => (
              <div
                key={index}
                onClick={() => handleSelect(index)}
                className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center
                  ${
                    selectedIndex === index
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  }`}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {address.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {address.street}, {address.city} {address.zip}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(index);
                    }}
                    className="px-3 py-1 text-xs bg-orange-600 font-semibold rounded-lg text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(index);
                    }}
                    className="p-2 text-xs bg-red-500 text-white rounded-lg font-semibold "
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingIndex !== null ? "Edit Address" : "Add Address"}
            </h3>

            <div className="flex flex-col gap-3">
              <input name="street" placeholder="Street" value={newAddress.street} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700" />
              <input name="city" placeholder="City" value={newAddress.city} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700" />
              <input name="zip" placeholder="ZIP Code" value={newAddress.zip} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700" />

              <select name="label" value={newAddress.label} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>

              <button onClick={handleAddOrUpdateAddress} className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
                {editingIndex !== null ? "Update" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Delivering to selected address
            </p>

            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressPage;