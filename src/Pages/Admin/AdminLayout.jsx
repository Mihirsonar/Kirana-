import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Table,
  Percent,
  Ticket,
  Image,
  DollarSign,
  Users,
  UserCheck,
  Wallet,
  FileText,
  History,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawUser = localStorage.getItem("User") || "Admin";
  let userName = "Admin";
  try {
    const parsed = JSON.parse(rawUser);
    userName = parsed.name || userName;
  } catch {
    userName = rawUser;
  }

  useEffect(() => {
    // Keep admin operations portal in clean, uniform light theme
    document.documentElement.classList.remove("dark");
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Stock and prices", path: "/admin/stock", icon: Table },
    { name: " Offers", path: "/admin/offers", icon: Percent },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
    { name: "Banners", path: "/admin/banners", icon: Image },
    { name: "Charges", path: "/admin/charges", icon: DollarSign },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Team", path: "/admin/team", icon: UserCheck },
    { name: "Cash", path: "/admin/cash", icon: Wallet },
    { name: "Reports", path: "/admin/reports", icon: FileText },
    { name: "Audit log", path: "/admin/audit-log", icon: History },
    { name: "Settings", path: "/admin/settings", icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Role");
    localStorage.removeItem("User");
    navigate("/login");
  };

  const isActive = (itemPath) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col md:flex-row font-sans text-gray-900">
      {/* ── MOBILE TOP BAR ────────────────────────────────────────────── */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-700" />
          <span className="font-bold text-gray-900 text-sm">Delight Supermarket</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── SIDEBAR (DESKTOP & MOBILE DRAWER) ─────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto py-3 px-3">
          {/* Logo / Brand */}
          <div className="px-3 py-2 mb-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
              K+
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Kirana+ Admin</h2>
              <p className="text-[11px] text-gray-400">Store Operations</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                    ? "bg-[#e8f5e9] text-[#1b5e20] font-semibold shadow-xs"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#2e7d32]" : "text-gray-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">+919876543210</p>
              <p className="text-[11px] text-gray-500 capitalize">{userName} (Admin)</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
