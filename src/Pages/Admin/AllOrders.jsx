import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import {
  Search,
  Filter,
  ShoppingBag,
  Clock,
  PackageCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.user?.name || "";
      const matchesSearch =
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        customer.toLowerCase().includes(search.toLowerCase());

      const s = (order.status || "").toLowerCase();
      const matchesStatus =
        filterStatus === "All" ||
        s === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  const stats = useMemo(() => {
    const total = orders.length;
    let pending = 0;
    let processing = 0;
    let delivered = 0;

    orders.forEach((o) => {
      const s = (o.status || "").toLowerCase();
      if (s === "pending" || s === "placed") pending++;
      else if (s === "processing" || s === "packing" || s.includes("out")) processing++;
      else if (s === "delivered") delivered++;
    });

    return { total, pending, processing, delivered };
  }, [orders]);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    if (s.includes("out") || s === "processing" || s === "packing") {
      return "bg-blue-50 text-blue-800 border-blue-200";
    }
    if (s === "pending" || s === "placed") {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Orders Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Live customer orders, fulfillment statuses, and dispatch controls ({orders.length} total)
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="p-2 text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl flex items-center gap-1.5 text-xs font-semibold self-start shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">{stats.total}</h2>
            <p className="text-[11px] text-gray-400 mt-1">All-time placed orders</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Pending</p>
            <h2 className="mt-2 text-3xl font-extrabold text-amber-600">{stats.pending}</h2>
            <p className="text-[11px] text-gray-400 mt-1">Awaiting confirmation</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Processing</p>
            <h2 className="mt-2 text-3xl font-extrabold text-blue-600">{stats.processing}</h2>
            <p className="text-[11px] text-gray-400 mt-1">Packing & out for delivery</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Delivered</p>
            <h2 className="mt-2 text-3xl font-extrabold text-emerald-600">{stats.delivered}</h2>
            <p className="text-[11px] text-gray-400 mt-1">Completed handovers</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-900"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-800"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending / Placed</option>
            <option value="Processing">Processing / Packing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading customer orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No orders found matching your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4 text-center">Items</th>
                    <th className="py-3 px-4 text-center">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrder === order._id;
                    return (
                      <React.Fragment key={order._id}>
                        <tr className="hover:bg-gray-50/70 transition">
                          {/* Order ID */}
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">
                            #{order._id.slice(-6)}
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900 text-xs">
                              {order.user?.name || "Customer"}
                            </p>
                          </td>

                          {/* Address */}
                          <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                            {order.address?.street
                              ? `${order.address.street}, ${order.address.city || ""}`
                              : "Standard Delivery Address"}
                          </td>

                          {/* Items count */}
                          <td className="py-3 px-4 text-center font-semibold text-gray-800">
                            {order.products?.length || 0}
                          </td>

                          {/* Total Amount */}
                          <td className="py-3 px-4 text-center font-extrabold text-emerald-700">
                            ₹{order.totalAmount}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status || "Processing"}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-center text-gray-500 text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          {/* Status Dropdown & Expand */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <select
                                value={order.status || "Processing"}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="Placed">Placed</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              <button
                                onClick={() =>
                                  setExpandedOrder(isExpanded ? null : order._id)
                                }
                                className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200 transition"
                                title="View Items"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Items */}
                        {isExpanded && (
                          <tr className="bg-gray-50/60">
                            <td colSpan="8" className="p-4">
                              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                                <h4 className="font-bold text-gray-900 text-xs">
                                  Ordered Grocery Items ({order.products?.length || 0})
                                </h4>
                                <div className="divide-y divide-gray-100">
                                  {order.products?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="py-2 flex items-center justify-between text-xs"
                                    >
                                      <span className="font-medium text-gray-800">
                                        {item.product?.name || "Grocery Item"}
                                      </span>
                                      <div className="flex items-center gap-4 text-gray-500">
                                        <span>Qty: {item.quantity}</span>
                                        <span className="font-semibold text-gray-900">
                                          ₹{item.price * item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
};

export default AllOrders;