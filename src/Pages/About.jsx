import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Store,
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "Delivery Time", value: "15 Mins", desc: "Average hyper-local delivery" },
    { label: "Daily Products", value: "5,000+", desc: "Fresh fruits, vegetables & staples" },
    { label: "Local Kirana Partners", value: "250+", desc: "Empowering neighborhood stores" },
    { label: "Happy Customers", value: "50,000+", desc: "Across Navi Mumbai & beyond" },
  ];

  const features = [
    {
      icon: Clock,
      title: "15-Minute Hyper-Local Delivery",
      desc: "Our dark stores and neighborhood partner shops ensure your groceries reach your doorstep before your water boils.",
    },
    {
      icon: Sparkles,
      title: "Farm-Fresh Guarantee",
      desc: "Direct farm-to-table sourcing every morning. If an item doesn't meet your freshness expectations, we replace it instantly.",
    },
    {
      icon: Store,
      title: "Empowering Local Kirana Stores",
      desc: "We don't replace local shopkeepers; we digitize them with modern inventory tools, bulk purchasing power, and PWA ordering.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Contactless Payments",
      desc: "Full Razorpay integration supporting UPI (GPay, PhonePe, Paytm), Cards, NetBanking, and Cash on Delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-purple-50/60 to-transparent dark:from-purple-950/20 dark:to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Our Story & Mission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Revolutionizing Your Everyday{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Grocery Experience
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Kirana+ bridges the warmth and trust of your local neighborhood kirana shop with the lightning speed of modern quick-commerce.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-all"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-center"
            >
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                {s.value}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {s.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Why Shop with Kirana+?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Built from the ground up for speed, quality, and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 sm:p-12 text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Ready to stock up on your fresh groceries?
          </h3>
          <p className="text-purple-100 text-sm mt-2 max-w-xl mx-auto">
            Order now and experience quick delivery right to your door.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-700 font-bold text-sm hover:bg-purple-50 transition shadow-md"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}