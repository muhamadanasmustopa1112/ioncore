"use client";
import { Eye, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { paths } from "@/config/paths";
import type { WorkOrderDashboardItem, WorkOrderState, WorkOrderType, Metadata } from "../types/technician-api";

const STATE_STYLES: Record<WorkOrderState, string> = {
  created:                    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  unassigned:                 "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900",
  assigned:                   "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  accepted:                   "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900",
  dispatched:                 "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-900",
  in_progress:                "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
  pending_noc_verification:   "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900",
  completed:                  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900",
  rescheduled:                "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900",
  cancelled:                  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900",
};

const STATE_LABELS: Record<WorkOrderState, string> = {
  created:                  "Created",
  unassigned:               "Unassigned",
  assigned:                 "Assigned",
  accepted:                 "Accepted",
  dispatched:               "Dispatched",
  in_progress:              "In Progress",
  pending_noc_verification: "Pending NOC",
  completed:                "Completed",
  rescheduled:              "Rescheduled",
  cancelled:                "Cancelled",
};

const TYPE_LABELS: Record<WorkOrderType, string> = {
  new_installation_broadband:  "New Install (Broadband)",
  new_installation_enterprise: "New Install (Enterprise)",
  maintenance:                 "Maintenance",
  termination:                 "Termination",
};

interface Props {
  items: WorkOrderDashboardItem[];
  metadata: Metadata | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function TechnicianWorkOrdersTable({
  items,
  metadata,
  isLoading,
  page,
  onPageChange,
}: Props) {
  const total = metadata?.count ?? 0;
  const perPage = metadata?.per_page ?? 15;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-outline overflow-hidden mb-6 sm:mb-8">
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-outline">
        {isLoading ? (
          <div className="px-4 py-12 text-center">
            <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-12 text-center text-slate-400 text-sm">
            No work orders found.
          </div>
        ) : (
          items.map((order) => {
            const engineers = order.assigned_team
              ?.map((t) => t.technician_name)
              .filter(Boolean)
              .join(" & ") || "—";

            return (
              <Link
                key={order.id}
                href={paths.dashboard.technician.detail.getHref(order.id)}
                className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                    {order.number}
                  </span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${STATE_STYLES[order.state] ?? ""}`}>
                    {STATE_LABELS[order.state] ?? order.state}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 line-clamp-1">
                  {order.title || "—"}
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  {TYPE_LABELS[order.type] ?? order.type}
                </p>
                <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <MapPin className="text-blue-500 size-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{order.site_name || "—"}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  <span className="font-semibold">Engineer:</span> {engineers}
                </p>
              </Link>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-surface-variant dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-outline">
            <tr>
              <th className="px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">WO Number</th>
              <th className="hidden xl:table-cell px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Title</th>
              <th className="px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Type</th>
              <th className="px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest">Location</th>
              <th className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Engineer</th>
              <th className="px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="px-3 lg:px-6 py-3 lg:py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No work orders found.
                </td>
              </tr>
            ) : (
              items.map((order) => {
                const engineers = order.assigned_team
                  ?.map((t) => t.technician_name)
                  .filter(Boolean)
                  .join(" & ") || "—";

                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-3 lg:px-6 py-3 lg:py-4 font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                      {order.number}
                    </td>
                    <td className="hidden xl:table-cell px-3 lg:px-6 py-3 lg:py-4 text-slate-700 dark:text-slate-300 max-w-[220px] truncate">
                      {order.title || "—"}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {TYPE_LABELS[order.type] ?? order.type}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-slate-600 dark:text-slate-400 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-blue-500 size-4 shrink-0" />
                        <span className="truncate">{order.site_name || "—"}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                      {engineers}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${STATE_STYLES[order.state] ?? ""}`}>
                        {STATE_LABELS[order.state] ?? order.state}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                      <Link href={paths.dashboard.technician.detail.getHref(order.id)}>
                        <button className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded transition-colors">
                          <Eye className="size-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-outline bg-surface-variant dark:bg-slate-800">
        <span className="text-xs text-slate-500 text-center sm:text-left">
          {total === 0
            ? "No entries"
            : <>Showing <b>{from}</b> to <b>{to}</b> of <b>{total}</b> entries</>}
        </span>
        <div className="flex gap-1 justify-center sm:justify-end flex-wrap">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold hover:bg-slate-50 text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-3 py-1 text-xs text-slate-400 self-center">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                disabled={isLoading}
                className={`px-3 py-1 rounded border text-xs font-semibold ${
                  p === page
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-slate-900 border-outline text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1 bg-white dark:bg-slate-900 border border-outline rounded text-xs font-semibold hover:bg-slate-50 text-slate-600 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
