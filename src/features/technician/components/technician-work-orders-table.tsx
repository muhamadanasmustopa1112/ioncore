"use client";
import { Eye, MapPin, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { paths } from "@/config/paths";

export function TechnicianWorkOrdersTable() {
  const orders = [
    { id: "WO-2023-00124", type: "New Installation", loc: "-6.2088, 106.8456", eng: "Budi Santoso & Agus Prasetyo", status: "On Going", statusClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900" },
    { id: "WO-2023-00125", type: "Maintenance", loc: "-6.2146, 106.8451", eng: "Rian Hidayat & Dedi Kusuma", status: "Finish", statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900" },
    { id: "WO-2023-00126", type: "Termination", loc: "-6.2201, 106.8410", eng: "Siti Aminah & Bambang", status: "Pending", statusClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900" },
    { id: "WO-2023-00127", type: "New Installation", loc: "-6.2100, 106.8400", eng: "Agus Supriatna & Eko Wibowo", status: "Abort", statusClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900" },
    { id: "WO-2023-00128", type: "Maintenance", loc: "-6.2250, 106.8500", eng: "Indra Jaya & Surya Kancana", status: "On Going", statusClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900" },
    { id: "WO-2023-00129", type: "New Installation", loc: "-6.2111, 106.8333", eng: "Taufik Hidayat & Ari Wibowo", status: "On Going", statusClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900" },
    { id: "WO-2023-00130", type: "Maintenance", loc: "-6.2188, 106.8400", eng: "Hadi Winoto & Slamet", status: "Finish", statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900" },
    { id: "WO-2023-00131", type: "New Installation", loc: "-6.2055, 106.8500", eng: "Andi Wijaya & Rizal", status: "On Going", statusClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900" },
    { id: "WO-2023-00132", type: "Termination", loc: "-6.2222, 106.8388", eng: "Dewi Sartika & Putra", status: "Pending", statusClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900" },
    { id: "WO-2023-00133", type: "Maintenance", loc: "-6.2100, 106.8488", eng: "Gunawan & Heri", status: "Finish", statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900" },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-outline overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-surface-variant dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-outline">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Work Order Number</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Work Order Type</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Work Order Location</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Assigned Engineer</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {orders.map((order, i) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.type}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap flex items-center gap-2">
                  <MapPin className="text-blue-500 size-4 shrink-0" /> {order.loc}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.eng}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${order.statusClass}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <Link href={paths.dashboard.technician.detail.getHref(order.id)}>
                    <button className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded transition-colors">
                      <Eye className="size-4" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-outline bg-surface-variant dark:bg-slate-800">
        <span className="text-xs text-on-surface-variant text-slate-500">Showing <b>1</b> to <b>10</b> of <b>124</b> entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold hover:bg-slate-50 text-slate-600 disabled:opacity-50" disabled>
            <ChevronLeft className="size-4" />
          </button>
          <button className="px-3 py-1 bg-primary text-white border border-primary rounded text-xs font-semibold">1</button>
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">2</button>
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">3</button>
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">...</button>
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">13</button>
          <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
