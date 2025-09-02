import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartHeader from '../Components/CartHeader';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    zip: '',
    label: 'Home',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // ✅ Load saved addresses on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // ✅ Save addresses whenever they change
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdateAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.zip) {
      if (editingIndex !== null) {
        const updated = [...addresses];
        updated[editingIndex] = newAddress;
        setAddresses(updated);
        setEditingIndex(null);
        toast.success('Address updated successfully!');
      } else {
        setAddresses((prev) => [...prev, newAddress]);
        toast.success('Address added successfully!');
      }
      setNewAddress({ street: '', city: '', zip: '', label: 'Home' });
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  const handleEditAddress = (index) => {
    setNewAddress(addresses[index]);
    setEditingIndex(index);
  };

  const handleDeleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    toast.info('Address deleted');
  };

  const handleSelectAddress = (address) => {
    localStorage.setItem('selectedAddress', JSON.stringify(address));
    toast.success('Address selected!');
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={1000} />
      <CartHeader currentStep="Address" />

      <div className="p-6 max-w-6xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Saved Addresses */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
          {addresses.length === 0 && (
            <p className="text-gray-500">No addresses added yet.</p>
          )}
          {addresses.map((address, index) => (
            <div
              key={index}
              className="border p-4 rounded-md mb-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <strong>{address.label}:</strong>
                <p>{address.street}, {address.city} {address.zip}</p>
              </div>
              <div className="flex gap-2">
                <Link to={'/payment'}>
                  <button
                    onClick={() => handleSelectAddress(address)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Select
                  </button>
                </Link>
                <button
                  onClick={() => handleEditAddress(index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Address Form */}
        <div className="bg-gray-50 p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={newAddress.street}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={newAddress.zip}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <select
              name="label"
              value={newAddress.label}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={handleAddOrUpdateAddress}
              className="bg-blue-500 text-white mt-2 px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              {editingIndex !== null ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressPage;
