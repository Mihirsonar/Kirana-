import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CartHeader from "../Components/CartHeader";
import "react-toastify/dist/ReactToastify.css";

const AddressPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
    label: "Home",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      return toast.error("Fill all fields", { style: { width: "260px" } });
    }

    if (editingIndex !== null) {
      const updated = [...addresses];
      updated[editingIndex] = newAddress;
      setAddresses(updated);
      setEditingIndex(null);
      toast.success("Address updated", { style: { width: "260px" } });
    } else {
      setAddresses((prev) => [...prev, newAddress]);
      toast.success("Address added", { style: { width: "260px" } });
    }

    setNewAddress({ street: "", city: "", zip: "", label: "Home" });
  };

  const handleEditAddress = (index) => {
    setNewAddress(addresses[index]);
    setEditingIndex(index);
  };

  const handleDeleteAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
    toast.info("Address removed", { style: { width: "260px" } });
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