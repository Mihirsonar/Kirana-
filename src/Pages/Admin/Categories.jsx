import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Layers, Plus, RefreshCw, Sparkles, Package } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdminCategories() {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      // Fallback: calculate from products
      try {
        const prodRes = await axios.get(`${BASE_URL}/api/products`);
        const prods = prodRes.data || [];
        const map = {};
        prods.forEach((p) => {
          const cat = p.category || "General";
          map[cat] = (map[cat] || 0) + 1;
        });
        const list = Object.keys(map).map((k) => ({
          name: k,
          productCount: map[k],
          avgPrice: 65,
        }));
        setCategories(list);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Store Categories
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Organize catalog collections and supermarket aisles ({categories.length} active categories)
            </p>
          </div>

          <button
            onClick={fetchCategories}
            className="p-2 text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl flex items-center gap-1.5 text-xs font-semibold self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:border-emerald-300 transition flex items-start justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.productCount} products listed
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
