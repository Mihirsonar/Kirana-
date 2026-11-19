import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  incrementQuantity,
  decrementQuantity,
} from "../redux/Slice/CartSlice";
import { ToastContainer } from "react-toastify";
import { isCategoryMatch } from "../Utils/categoryMatcher";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const ProductPage = ({
  category = "All",
  title,
  hideTitle = false,
  onClearFilter,
  page = 1,
  onPageChange,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { searchQuery } = useSelector((state) => state.product);

  // All products fetched from backend (unfiltered)
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = category || "All";

  // Fetch ALL products from local backend once
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Handle both { products: [...] } and plain array responses
        const list = Array.isArray(data) ? data : data.products || [];
        setAllProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Unable to fetch products (may be offline):", err);
        setLoading(false);
      });
  }, []); // only on mount

  // ── Step 1: Filter by category + search query ──
  const filteredProducts = useMemo(() => {
    const query = (searchQuery || "").trim().toLowerCase();
    return allProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);
      const matchesCat = isCategoryMatch(product.category, activeCategory);
      return matchesSearch && matchesCat;
    });
  }, [allProducts, searchQuery, activeCategory]);

  // ── Step 2: Paginate the filtered list ──
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const addToCart = (product) => dispatch(add(product));

  const displayTitle =
    title ||
    (activeCategory !== "All" ? `${activeCategory} Products` : "All Products");

  // ── Pagination helpers ──
  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange?.(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] > 1) {
      range.unshift("...");
      range.unshift(1);
    }
    if (range[range.length - 1] < totalPages) {
      range.push("...");
      range.push(totalPages);
    }
    return range;
  }, [totalPages, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ToastContainer />

      {!hideTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{displayTitle}</span>
            {!loading && filteredProducts.length > 0 && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ({filteredProducts.length})
              </span>
            )}
          </h2>
          {!loading && totalPages > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
          )}
        </div>
      )}

      {/* SKELETON */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
      ) : filteredProducts.length === 0 ? (
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {pagedProducts.map((product) => {
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
                  <p className="text-xs text-gray-500 mb-2">{product.quantity}</p>

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

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold
                  bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              {/* Page numbers */}
              {pageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-2 text-gray-400 text-sm select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                      p === page
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold
                  bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
