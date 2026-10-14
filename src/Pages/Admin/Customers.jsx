import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Users, Search, Mail, MapPin, ShoppingBag, RefreshCw } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdminCustomers() {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.customers) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.warn("Falling back for customers list:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Customer Directory
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review customer accounts, registered addresses, and purchase frequency ({customers.length} total)
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            className="p-2 text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl flex items-center gap-1.5 text-xs font-semibold self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
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
              placeholder="Search by customer name or email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading customer directory...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No registered customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Saved Address</th>
                    <th className="py-3 px-4 text-center">Orders Placed</th>
                    <th className="py-3 px-4 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((c) => {
                    const primaryAddr = c.addresses?.[0];
                    return (
                      <tr key={c._id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900 text-xs">{c.name}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{c.email}</span>
                          </p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {primaryAddr ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-xs">
                                {primaryAddr.street}, {primaryAddr.city} - {primaryAddr.zip}
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">No address on file</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                            {c.orderCount || 0} orders
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          ₹{c.totalSpent || 0}
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
