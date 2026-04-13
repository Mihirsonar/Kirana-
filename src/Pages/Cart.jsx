import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartHeader from "../Components/CartHeader";
import {
  incrementQuantity,
  decrementQuantity,
} from "../redux/Slice/CartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {cartItems.length > 0 && <CartHeader currentStep="Cart" />}

      <div className="max-w-4xl mx-auto px-4 py-6">

        {cartItems.length > 0 ? (
          <>
            {/* CART ITEMS */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-800 p-1"
                    />

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {item.description}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">

                    {/* QUANTITY STEPPER */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => dispatch(decrementQuantity(item._id))}
                        className="px-3 py-1 text-red-500 font-bold"
                      >
                        −
                      </button>

                      <span className="px-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => dispatch(incrementQuantity(item._id))}
                        className="px-3 py-1 text-green-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SPACING FOR STICKY BAR */}
            <div className="h-24" />
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Your cart is empty 🛒
            </h2>
            <p className="text-gray-500 mt-2">
              Looks like you haven’t added anything yet
            </p>

            <Link to="/">
              <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* 🔥 STICKY CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{total}
              </p>
            </div>

            <Link to="/address">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Checkout →
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;