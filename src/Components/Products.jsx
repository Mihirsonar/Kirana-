import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/Slice/ProductSlice";
import {
  add,
  incrementQuantity,
  decrementQuantity,
} from "../redux/Slice/CartSlice";
import { ToastContainer } from "react-toastify";
import { isCategoryMatch } from "../Utils/categoryMatcher";

const ProductPage = ({ category = "All", title, hideTitle = false, onClearFilter }) => {
  const dispatch = useDispatch();
  const { products, searchQuery } = useSelector((state) => state.product);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const [loading, setLoading] = useState(!products || products.length === 0);

  const activeCategory = category || "All";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        dispatch(setProducts(data));
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Unable to fetch fresh products (may be offline):", err);
        setLoading(false);
      });
  }, [dispatch]);

  const displayedProducts = useMemo(() => {
    const list = products && products.length > 0 ? products : [];
    const query = (searchQuery || "").trim().toLowerCase();

    return list.filter((product) => {
      const matchesSearch =
        !query ||
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query));

      const matchesCat = isCategoryMatch(product.category, activeCategory);

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product) => {
    dispatch(add(product));
  };

  const displayTitle =
    title ||
    (activeCategory && activeCategory !== "All"
      ? `${activeCategory} Products`
      : "Trending Products");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ToastContainer />

      {!hideTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{displayTitle}</span>
            {!loading && displayedProducts.length > 0 && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ({displayedProducts.length})
              </span>
            )}
          </h2>
        </div>
      )}

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
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-3xl">
            🧺
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            No products found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-5">
            {searchQuery
              ? `No products matching "${searchQuery}" in ${activeCategory}.`
              : `There are currently no products available under ${activeCategory}.`}
          </p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              View All Products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {displayedProducts.map((product) => {
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
                  {product.description || product.name}
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