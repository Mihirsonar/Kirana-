import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Table,
  Search,
  Save,
  Check,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function StockAndPrices() {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", quantity: "" });
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stock ledger");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingRow(p._id);
    setEditValues({
      price: p.price,
      quantity: p.quantity,
    });
  };

  const handleSave = async (id) => {
    setSavingId(id);
    const token = localStorage.getItem("Token");
    try {
      await axios.put(
        `${BASE_URL}/api/admin/products/${id}/stock`,
        {
          price: Number(editValues.price),
          quantity: String(editValues.quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Price & stock updated! 📈");
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, price: Number(editValues.price), quantity: editValues.quantity }
            : p
        )
      );
      setEditingRow(null);
    } catch (err) {
      // Fallback to standard PUT /api/products/:id
      try {
        await axios.put(
          `${BASE_URL}/api/products/${id}`,
          {
            price: Number(editValues.price),
            quantity: String(editValues.quantity),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Updated successfully");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id
              ? { ...p, price: Number(editValues.price), quantity: editValues.quantity }
              : p
          )
        );
        setEditingRow(null);
      } catch (e) {
        toast.error("Failed to update item");
      }
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Stock & Prices Ledger
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Live price controls, SKU quantities, and inventory ledger counter
            </p>
          </div>

          <button
            onClick={fetchProducts}
            className="p-2 text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl flex items-center gap-1.5 text-xs font-semibold self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading inventory stock ledger...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No products found in the ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item & Category</th>
                    <th className="py-3 px-4">Unit / Package</th>
                    <th className="py-3 px-4">Selling Price (₹)</th>
                    <th className="py-3 px-4 text-center">Ledger Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => {
                    const isEditing = editingRow === p._id;
                    const isSaving = savingId === p._id;

                    return (
                      <tr key={p._id} className="hover:bg-gray-50/70 transition">
                        {/* Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || "https://via.placeholder.com/40"}
                              alt={p.name}
                              className="w-9 h-9 object-contain rounded-lg border border-gray-200 bg-white p-0.5"
                            />
                            <div>
                              <p className="font-bold text-gray-900 text-xs">{p.name}</p>
                              <span className="text-[10px] text-gray-500 font-medium">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Quantity / Unit */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValues.quantity}
                              onChange={(e) =>
                                setEditValues({ ...editValues, quantity: e.target.value })
                              }
                              className="w-24 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          ) : (
                            <span className="font-medium text-gray-700">{p.quantity}</span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 font-bold">₹</span>
                              <input
                                type="number"
                                value={editValues.price}
                                onChange={(e) =>
                                  setEditValues({ ...editValues, price: e.target.value })
                                }
                                className="w-24 px-2 py-1 text-xs font-bold text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-gray-900 text-sm">₹{p.price}</span>
                          )}
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>Active in Stock</span>
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingRow(null)}
                                className="px-2.5 py-1 text-[11px] text-gray-500 hover:bg-gray-100 rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(p._id)}
                                disabled={isSaving}
                                className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
                              >
                                <Save className="w-3 h-3" />
                                <span>{isSaving ? "Saving..." : "Save"}</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(p)}
                              className="px-3 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-200"
                            >
                              Edit Price / Qty
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
