import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/Slice/CartSlice";
import CartHeader from "../Components/CartHeader";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Cart from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [selectedAddress, setSelectedAddress] = useState(null);

  // ✅ Load saved address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, []);

  // ✅ Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  // ✅ Handle payment
  const handlePayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address 🚚");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty 🛒");
      return;
    }

    dispatch(clearCart());
    toast.success("Payment Successful 🎉");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <ToastContainer position="bottom-left" autoClose={1000} />
      <CartHeader currentStep="Payment" />

      <div className="p-6 max-w-3xl my-12 mx-auto bg-gray-100 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Payment</h2>

        {/* ✅ Selected Address */}
        {selectedAddress ? (
          <div className="mb-4 p-3 border rounded-md bg-white">
            <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
            <p>
              <strong>{selectedAddress.label}:</strong>{" "}
              {selectedAddress.street}, {selectedAddress.city}{" "}
              {selectedAddress.zip}
            </p>
          </div>
        ) : (
          <p className="text-red-500 mb-4">
            ⚠️ No address selected. Please go back and choose one.
          </p>
        )}

        {/* ✅ Cart Items */}
        <div className="mb-4 p-4 border rounded-md bg-white">
          <h3 className="text-lg font-medium mb-3">Your Items</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty 🛒</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ✅ Payment Method */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Payment Method</h3>
          <select
            className="w-full p-2 border rounded-md"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        {/* ✅ Order Summary */}
        <div className="mb-4 p-4 border rounded-md bg-white">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Shipping: ₹{shipping.toFixed(2)}</p>
          <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
        </div>

        {/* ✅ Pay Now Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handlePayment}
          disabled={cartItems.length === 0}
        >
          Pay Now
        </button>
      </div>
    </>
  );
};

export default PaymentPage;
