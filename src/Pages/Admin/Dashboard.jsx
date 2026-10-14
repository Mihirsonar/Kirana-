import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  Calendar,
  ShoppingBag,
  PackagePlus,
  TrendingUp,
  Truck,
  Store,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    storeSettings: {
      storeName: "Delight Supermarket",
      storeSubtitle: "Store management and live operations counter.",
    },
    netSales: 0,
    completedOrders: 0,
    totalOrders: 0,
    aov: 0,
    ordersByStatus: [
      { status: "Placed", count: 0, percentage: 0 },
      { status: "Confirmed", count: 0, percentage: 0 },
      { status: "Packing", count: 0, percentage: 0 },
      { status: "Out for delivery", count: 0, percentage: 0 },
      { status: "Ready for pickup", count: 0, percentage: 0 },
      { status: "Delivered", count: 0, percentage: 0 },
    ],
    fulfilment: {
      homeDelivery: 0,
      storePickup: 0,
    },
    paymentSplit: {
      total: 0,
      cod: 0,
      online: 0,
      codPercentage: 50,
      onlinePercentage: 50,
    },
    recentOrders: [],
  });

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Vegetables",
    quantity: "1 kg",
    image: "",
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    fetchDashboardData(selectedDate);
  }, [selectedDate]);

  const fetchDashboardData = async (date) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const res = await axios.get(`${BASE_URL}/api/admin/dashboard-stats?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn("Using local fallback calculations for admin dashboard:", err);
      // Fallback calculation using /api/orders/admin if dedicated endpoint is not yet restarted
      try {
        const token = localStorage.getItem("Token");
        const orderRes = await axios.get(`${BASE_URL}/api/orders/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = orderRes.data?.orders || [];
        calculateLocalStats(orders);
      } catch (e) {
        console.error("Failed to load orders:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalStats = (orders) => {
    const total = orders.length;
    const completedList = orders.filter((o) => (o.status || "").toLowerCase() === "delivered");
    const net = completedList.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const avg = completedList.length > 0 ? Math.round(net / completedList.length) : 0;

    const counts = {
      Placed: 0,
      Confirmed: 0,
      Packing: 0,
      "Out for delivery": 0,
      "Ready for pickup": 0,
      Delivered: 0,
    };

    orders.forEach((o) => {
      const s = (o.status || "").toLowerCase();
      if (s === "pending" || s === "placed") counts.Placed++;
      else if (s === "confirmed") counts.Confirmed++;
      else if (s === "processing" || s === "packing") counts.Packing++;
      else if (s.includes("out")) counts["Out for delivery"]++;
      else if (s.includes("pickup")) counts["Ready for pickup"]++;
      else if (s === "delivered") counts.Delivered++;
      else counts.Placed++;
    });

    const statusArr = Object.keys(counts).map((key) => ({
      status: key,
      count: counts[key],
      percentage: total > 0 ? Math.round((counts[key] / total) * 100) : 0,
    }));

    let online = 0;
    let cod = 0;
    orders.forEach((o) => {
      const amt = Number(o.totalAmount) || 0;
      if (o.razorpayOrderId || o.razorpayPaymentId) online += amt;
      else cod += amt;
    });

    setStats((prev) => ({
      ...prev,
      totalOrders: total,
      completedOrders: completedList.length,
      netSales: net,
      aov: avg,
      ordersByStatus: statusArr,
      fulfilment: {
        homeDelivery: total,
        storePickup: 0,
      },
      paymentSplit: {
        total: online + cod,
        cod,
        online,
        codPercentage: online + cod > 0 ? Math.round((cod / (online + cod)) * 100) : 50,
        onlinePercentage: online + cod > 0 ? Math.round((online / (online + cod)) * 100) : 50,
      },
      recentOrders: orders.slice(0, 8),
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmittingProduct(true);
    try {
      const token = localStorage.getItem("Token");
      await axios.post(
        `${BASE_URL}/api/products`,
        {
          ...newProduct,
          price: Number(newProduct.price),
          image: newProduct.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product created successfully! 📦");
      setShowProductModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Vegetables",
        quantity: "1 kg",
        image: "",
      });
      fetchDashboardData(selectedDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── STORE HEADER ────────────────────────────────────────────── */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.storeSettings?.storeName || "Delight Supermarket"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.storeSettings?.storeSubtitle || "Store management and live operations counter."}
          </p>
        </div>

        {/* ── ACTION BAR ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Viewing Date */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 shrink-0">Viewing date</span>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs font-medium text-gray-800 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
            <button
              onClick={() => fetchDashboardData(selectedDate)}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={() => navigate("/admin/orders")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 bg-white transition shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live Orders</span>
            </button>

            <button
              onClick={() => setShowProductModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 bg-white transition shadow-xs"
            >
              <PackagePlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>New Product</span>
            </button>

            <button
              onClick={() => navigate("/admin/stock")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 bg-white transition shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Stock Ledger</span>
            </button>
          </div>
        </div>

        {/* ── 3 METRIC TILES ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Net Sales */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">
              Net sales ({selectedDate})
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              ₹{stats.netSales}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1">
              Delivered & picked-up orders
            </p>
          </div>

          {/* Card 2: Completed Orders */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">
              Completed orders
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats.completedOrders}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1">
              Out of {stats.totalOrders} total placed
            </p>
          </div>

          {/* Card 3: AOV */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">
              Average order value (AOV)
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              ₹{stats.aov}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1">
              Per completed order
            </p>
          </div>
        </div>

        {/* ── MIDDLE 2-COLUMN SECTION ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Orders by status */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">
                Orders by status
              </h3>
              <span className="text-xs font-semibold text-gray-400">
                {stats.totalOrders} total
              </span>
            </div>

            <div className="space-y-4">
              {stats.ordersByStatus.map((item) => (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-700">{item.status}</span>
                    <span className="text-gray-400 font-semibold">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === "Delivered"
                          ? "bg-emerald-600"
                          : item.status.includes("Out")
                          ? "bg-blue-600"
                          : item.status === "Packing"
                          ? "bg-amber-500"
                          : "bg-purple-600"
                      }`}
                      style={{ width: `${Math.max(item.percentage, item.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Fulfilment + Payment split */}
          <div className="lg:col-span-5 space-y-4">
            {/* Fulfilment distribution */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-3">
                Fulfilment distribution
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Home delivery */}
                <div className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">Home delivery</p>
                    <p className="text-lg font-extrabold text-gray-900">
                      {stats.fulfilment?.homeDelivery || 0}
                    </p>
                  </div>
                </div>

                {/* Store pickup */}
                <div className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">Store pickup</p>
                    <p className="text-lg font-extrabold text-gray-900">
                      {stats.fulfilment?.storePickup || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment split */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">
                  Payment split
                </h3>
                <span className="text-xs font-semibold text-gray-400">
                  Total: ₹{stats.paymentSplit?.total || 0}
                </span>
              </div>

              {/* Segmented Bar */}
              <div className="w-full h-2.5 rounded-full bg-gray-100 flex overflow-hidden mb-3">
                <div
                  className="bg-emerald-700 h-full transition-all duration-300"
                  style={{ width: `${stats.paymentSplit?.codPercentage || 50}%` }}
                  title={`COD: ₹${stats.paymentSplit?.cod || 0}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${stats.paymentSplit?.onlinePercentage || 50}%` }}
                  title={`Online/UPI: ₹${stats.paymentSplit?.online || 0}`}
                />
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                    <span>Cash on delivery / pickup</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{stats.paymentSplit?.cod || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>UPI dynamic QR / Online</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{stats.paymentSplit?.online || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NEW PRODUCT MODAL ───────────────────────────────────────── */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <PackagePlus className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-gray-900 text-base">Add New Product</h3>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Fresh Red Onions"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g. 45"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Quantity / Unit *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="e.g. 1 kg or 500g"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Dairy & Bakery">Dairy & Bakery</option>
                      <option value="Snacks & Munchies">Snacks & Munchies</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Staples & Grains">Staples & Grains</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Freshly sourced quality produce..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition disabled:opacity-50"
                  >
                    {submittingProduct ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
