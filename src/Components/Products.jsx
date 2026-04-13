import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/Slice/ProductSlice";
import {
  add,
  incrementQuantity,
  decrementQuantity,
} from "../redux/Slice/CartSlice";
import { ToastContainer, toast } from "react-toastify";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { filteredProducts } = useSelector((state) => state.product);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://local-swart.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setProducts(data));
        setLoading(false);
      });
  }, [dispatch]);

  const addToCart = (product) => {
    dispatch(add(product));
    // toast.success("Added to cart 🛒", {
    //   position: "bottom-left",
    //   autoClose: 1500,
    //   theme: "colored",
    // });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Trending Products
      </h2>

      {/* SKELETON */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white dark:bg-gray-800 p-3 shadow animate-pulse"
            >
              <div className="h-36 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {filteredProducts.map((product) => {
            const cartItem = cartItems.find(
              (item) => item._id === product._id
            );

            return (
              <div
                key={product._id}
                className="group rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition p-3 flex flex-col"
              >
                {/* IMAGE */}
                <div className="h-36 flex items-center justify-center mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain group-hover:scale-105 transition"
                  />
                </div>

                {/* INFO */}
                <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-1">
                  {product.description}
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  {product.quantity}
                </p>

                {/* PRICE + CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{product.price}
                  </span>

                  {cartItem ? (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch(decrementQuantity(product._id))
                        }
                        className="px-2 py-1 text-red-500 font-bold"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-semibold">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(incrementQuantity(product._id))
                        }
                        className="px-2 py-1 text-green-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPage;