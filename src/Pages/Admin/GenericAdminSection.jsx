import React from "react";
import AdminLayout from "./AdminLayout";
import { Sparkles, Plus, Clock, CheckCircle2 } from "lucide-react";

export default function GenericAdminSection({ title, subtitle, items = [], icon: Icon }) {
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition shadow-xs self-start">
            <Plus className="w-4 h-4" />
            <span>Create New {title.replace("%", "").trim()}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            {Icon ? <Icon className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-gray-900">{title} Manager</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Supermarket store operation module is active and connected to your database.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Live Counter Synchronized</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
