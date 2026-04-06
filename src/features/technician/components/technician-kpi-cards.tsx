import { TrendingUp, History, AlertTriangle, TrendingDown } from "lucide-react";
export function TechnicianKpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-900 p-5 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Engineer</span>
        <span className="text-2xl font-bold text-primary">42</span>
        <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase">
          <TrendingUp className="size-3" /> 8.4% from yesterday
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Today Work Order</span>
        <span className="text-2xl font-bold text-primary">124</span>
        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
          <History className="size-3" /> Normal volume
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending Work Order</span>
        <span className="text-2xl font-bold text-amber-600">18</span>
        <div className="flex items-center gap-1 text-rose-600 text-[10px] font-bold uppercase">
          <AlertTriangle className="size-3" /> Needs Attention
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded shadow-sm border border-outline flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Abort Work Order</span>
        <span className="text-2xl font-bold text-rose-600">4</span>
        <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase">
          <TrendingDown className="size-3" /> 2 less than yesterday
        </div>
      </div>
    </div>
  );
}
