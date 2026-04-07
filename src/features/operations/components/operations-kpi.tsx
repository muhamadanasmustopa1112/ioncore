import { AlertTriangle, Cog, Ticket, XCircle } from "lucide-react";

export function OperationsKpi() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-outline flex flex-col gap-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-6 -mt-6"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Area Outages</span>
        <span className="text-3xl font-black text-red-500">12</span>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-[10px] font-bold rounded">HIGH PRIORITY</span>
          <AlertTriangle className="text-red-500 size-4" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Maintenance Orders</span>
        <span className="text-3xl font-black text-on-surface">45</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <Cog className="size-4" />
          <span className="text-[10px] font-bold">Active Scheduled</span>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Open Tickets</span>
        <span className="text-3xl font-black text-on-surface">82</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <Ticket className="size-4" />
          <span className="text-[10px] font-bold">Queue Pending</span>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Termination Orders</span>
        <span className="text-3xl font-black text-on-surface">28</span>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400">
          <XCircle className="size-4" />
          <span className="text-[10px] font-bold">Processing</span>
        </div>
      </div>
    </div>
  );
}
