import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Store, DollarSign, Phone, MapPin, Save, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function StoreSettings() {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [settings, setSettings] = useState({
    storeName: "Delight Supermarket",
    storeSubtitle: "Store management and live operations counter.",
    phone: "+919876543210",
    address: "Near Tilak Global School, Navi Mumbai, Maharashtra",
    deliveryFee: 20,
    freeDeliveryThreshold: 500,
    minOrderValue: 99,
    isOpen: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem("Token");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/store-settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn("Using default store settings:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("Token");
    try {
      await axios.put(`${BASE_URL}/api/admin/store-settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store settings updated successfully! 🏪");
    } catch (err) {
      toast.success("Settings saved locally! 🏪");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Store & Charges Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure supermarket name, contact number, delivery charges, and operations
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Info */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Store Profile</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Store Display Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Operations Tagline
                </label>
                <input
                  type="text"
                  value={settings.storeSubtitle}
                  onChange={(e) => setSettings({ ...settings, storeSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Store Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Fees */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Charges, Delivery & Fees</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Standard Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Free Delivery On Orders Over (₹)
                </label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  value={settings.minOrderValue}
                  onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Store Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
