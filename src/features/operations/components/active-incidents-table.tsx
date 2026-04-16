"use client";
import Link from "next/link";
import { Filter, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { paths } from "@/config/paths";
const connections = [
  { pop: "Jakarta Timur", area: "Condet", subArea: "120", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { pop: "Jakarta Timur", area: "Kalisari", subArea: "64", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { pop: "Depok", area: "Cilangkap Tapos", subArea: "128", status: "Connected", uplink: "Need Checking", notification: "High Latency", notificationClass: "text-amber-600 font-medium italic", uplinkColor: "bg-amber-500 animate-pulse", uplinkTextClass: "text-amber-700 font-medium" },
  { pop: "Jakarta Timur", area: "Bambu Apus", subArea: "99", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { pop: "Jakarta Timur", area: "Ciracas", subArea: "107", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { pop: "Jakarta Timur", area: "Tanah Merdeka", subArea: "86", status: "Connected", uplink: "Need Checking", notification: "Instability Reported", notificationClass: "text-amber-600 font-medium italic", uplinkColor: "bg-amber-500", uplinkTextClass: "text-amber-700 font-medium" },
  { pop: "Jakarta Timur", area: "Kranggan", subArea: "79", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
];
export function ActiveIncidentsTable() {
  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="w-full md:max-w-xs space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Search Customer ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input 
              className="w-full bg-background border border-input rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground" 
              placeholder="Ex: CUST-12345..." 
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="bg-card rounded shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted">
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Connection Status Matrix</h4>
          <div className="flex gap-2">
            <button className="bg-white border border-outline px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2 text-slate-700">
              <Filter className="size-4" /> Filter
            </button>
            <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 flex items-center gap-2">
              <Download className="size-4" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/50 dark:bg-slate-800/50 border-b border-outline">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">POP</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Area</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Sub-Area</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">ONT Connected</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Uplink Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Notification</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {connections.map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-semibold text-foreground">{row.pop}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{row.area}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{row.subArea}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.uplinkColor}`}></div>
                      <span className={`text-xs ${row.uplinkTextClass || "text-slate-600 dark:text-slate-400"}`}>{row.uplink}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-xs ${row.notificationClass || "text-slate-400"}`}>
                    {row.notification}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={paths.dashboard.operations.connectivity.getHref("ION-CUST-2024-0892")} 
                      className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded transition-colors border border-blue-700/20"
                    >
                      WO Maintenance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted">
          <span className="text-xs text-muted-foreground">Showing <b>1</b> to <b>7</b> of <b>52</b> entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold hover:bg-muted/50 disabled:opacity-50 text-muted-foreground" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-primary-foreground border border-primary rounded text-xs font-semibold">1</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50">2</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50">3</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50">...</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50">6</button>
            <button className="px-3 py-1 bg-background border border-border rounded text-xs font-semibold text-muted-foreground hover:bg-muted/50">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
