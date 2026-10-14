import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../redux/Slice/ThemeSlice";
import PushNotificationToggle from "../Components/PWA/PushNotificationToggle";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Trash2,
  Download,
  Smartphone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function Settings() {
  const dispatch = useDispatch();
  const currentMode = useSelector((state) => state.theme.mode || "light");
  const isDarkMode = useSelector((state) => state.theme.darkmode);

  const [isStandalone, setIsStandalone] = useState(false);
  const [cacheSize, setCacheSize] = useState("Checking...");
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Estimate storage usage
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usageMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        setCacheSize(`${usageMB} MB`);
      });
    } else {
      setCacheSize("N/A");
    }
  }, []);

  const handleThemeChange = (mode) => {
    dispatch(setThemeMode(mode));
    toast.success(`Theme set to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((k) => k.includes("products") || k.includes("images") || k.includes("api"))
            .map((k) => caches.delete(k))
        );
      }
      toast.success("Cache cleared! Reloading fresh data...");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cache");
    } finally {
      setIsClearing(false);
    }
  };

  const themeOptions = [
    {
      id: "light",
      name: "Light Mode",
      desc: "Clean, classic white appearance",
      icon: Sun,
      iconColor: "text-amber-500",
      bgPreview: "bg-white border-gray-200 text-gray-900",
    },
    {
      id: "dark",
      name: "Dark Mode",
      desc: "Easy on the eyes in low light",
      icon: Moon,
      iconColor: "text-indigo-400",
      bgPreview: "bg-gray-900 border-gray-700 text-white",
    },
    {
      id: "system",
      name: "System Default",
      desc: "Follows your device's preference",
      icon: Laptop,
      iconColor: "text-blue-500",
      bgPreview: "bg-gradient-to-r from-white to-gray-900 border-gray-400 text-gray-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            App Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize your Kirana+ experience, theme, notifications, and offline storage.
          </p>
        </div>

        {/* ── THEME APPEARANCE ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Appearance & Theme
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
            Select your preferred display theme across the application.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleThemeChange(opt.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 ring-2 ring-purple-500/20 shadow-sm"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Icon className={`w-5 h-5 ${opt.iconColor}`} />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {opt.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PUSH NOTIFICATIONS ──────────────────────────────────────── */}
        <PushNotificationToggle />

        {/* ── PWA & APP DETAILS ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Application & Storage
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
            Manage local data and review Progressive Web App installation status.
          </p>

          <div className="space-y-4">
            {/* Install Status */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    App Installation
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isStandalone ? "Running in standalone app mode" : "Running in web browser mode"}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  isStandalone
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                }`}
              >
                {isStandalone ? "Installed App" : "Web Mode"}
              </span>
            </div>

            {/* Storage Usage & Clear */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Cached Data Storage
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Offline cache size: {cacheSize}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearCache}
                disabled={isClearing}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isClearing ? "animate-spin" : ""}`} />
                {isClearing ? "Clearing..." : "Clear Cache"}
              </button>
            </div>
          </div>
        </div>

        {/* ── ABOUT KIRANA+ ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Kirana+ Version 2.0.0 (PWA)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Encrypted JWT Auth • Razorpay Payments • Workbox Offline Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
