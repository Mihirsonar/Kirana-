import React, { useState } from "react";
import ProductPage from "../Components/Products";
import { Sparkles, Filter } from "lucide-react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Vegetables",
    "Fruits",
    "Dairy & Bakery",
    "Snacks & Munchies",
    "Beverages",
    "Staples & Grains",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>100% Fresh Guaranteed</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              All Grocery Products
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Fresh veggies, fruits, dairy, snacks, and daily essentials delivered in 15 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="py-4">
        <ProductPage />
      </main>
    </div>
  );
}
