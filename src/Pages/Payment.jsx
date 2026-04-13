import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/Slice/CartSlice";
import CartHeader from "../Components/CartHeader";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) setSelectedAddress(JSON.parse(saved));
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const delivery = cartItems.length ? 20 : 0;
  const total = subtotal + delivery;

  const handlePayment = () => {
    if (!selectedAddress) return toast.error("Select address first 🚚");
    if (!cartItems.length) return toast.error("Cart is empty 🛒");

    dispatch(clearCart());
    toast.success("Order placed 🎉");

    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
           <ToastContainer
              position="bottom-right"
              autoClose={1000}
              toastStyle={{ width: "260px", borderRadius: "10px" }}
            />
      <CartHeader currentStep="Payment" />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ADDRESS */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-2 dark:text-white">
                Delivery Address
              </h3>

              {selectedAddress ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAddress.street}, {selectedAddress.city} -{" "}
                  {selectedAddress.zip}
                </p>
              ) : (
                <p className="text-red-500 text-sm">
                  No address selected
                </p>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-3 dark:text-white">
                Payment Method
              </h3>

              <div className="grid gap-3">
                {["UPI", "Card", "Cash on Delivery"].map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === method
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="font-medium dark:text-white">
                      {method}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ITEMS */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-3 dark:text-white">
                Order Items
              </h3>

              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        className="w-12 h-12 object-contain"
                        alt=""
                      />
                      <span className="dark:text-white">
                        {item.quantity} × {item.name}
                      </span>
                    </div>

                    <span className="font-medium dark:text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5">

              <h3 className="font-semibold mb-4 dark:text-white">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="dark:text-white">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Delivery
                </span>
                <span className="dark:text-white">₹{delivery}</span>
              </div>

              <div className="border-t my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span className="dark:text-white">Total</span>
                <span className="text-green-600">₹{total}</span>
              </div>

              {/* CTA */}
              <button
                onClick={handlePayment}
                disabled={!cartItems.length}
                className="w-full mt-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                Place Order →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;