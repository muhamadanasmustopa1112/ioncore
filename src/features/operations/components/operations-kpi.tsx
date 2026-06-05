"use client";

import { useState } from "react";
import { AlertTriangle, Cog, Ticket, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DUMMY_KPI = {
  area_outages: 12,
  maintenance_orders: 45,
  open_tickets: 82,
  termination_orders: 28,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function useOperationsKpi() {
  const [data] = useState(DUMMY_KPI);
  const [isLoading] = useState(false);
  return { data, isLoading };
}

export function OperationsKpi() {
  const { data: kpi, isLoading } = useOperationsKpi();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card p-6 rounded shadow-sm border border-outline">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-card p-6 rounded shadow-sm border border-outline flex flex-col gap-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-6 -mt-6"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Area Outages</span>
        <span className="text-3xl font-black text-red-500">{kpi?.area_outages ?? 0}</span>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-[10px] font-bold rounded">HIGH PRIORITY</span>
          <AlertTriangle className="text-red-500 size-4" />
        </div>
      </div>
      <div className="bg-card p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Maintenance Orders</span>
        <span className="text-3xl font-black text-on-surface">{kpi?.maintenance_orders ?? 0}</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <Cog className="size-4" />
          <span className="text-[10px] font-bold">Active Scheduled</span>
        </div>
      </div>
      <div className="bg-card p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Open Tickets</span>
        <span className="text-3xl font-black text-on-surface">{kpi?.open_tickets ?? 0}</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <Ticket className="size-4" />
          <span className="text-[10px] font-bold">Queue Pending</span>
        </div>
      </div>
      <div className="bg-card p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Termination Orders</span>
        <span className="text-3xl font-black text-on-surface">{kpi?.termination_orders ?? 0}</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <XCircle className="size-4" />
          <span className="text-[10px] font-bold">Processing</span>
        </div>
      </div>
    </div>
  );
}
