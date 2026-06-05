"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, Search, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { paths } from "@/config/paths";

const connections = [
  { id: "ION-CUST-2024-0892", pop: "Jakarta Timur", area: "Condet", subArea: "120", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { id: "ION-CUST-2024-0893", pop: "Jakarta Timur", area: "Kalisari", subArea: "64", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { id: "ION-CUST-2024-0894", pop: "Depok", area: "Cilangkap Tapos", subArea: "128", status: "Connected", uplink: "Need Checking", notification: "High Latency", notificationClass: "text-amber-600 font-medium italic", uplinkColor: "bg-amber-500 animate-pulse", uplinkTextClass: "text-amber-700 font-medium" },
  { id: "ION-CUST-2024-0895", pop: "Jakarta Timur", area: "Bambu Apus", subArea: "99", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { id: "ION-CUST-2024-0896", pop: "Jakarta Timur", area: "Ciracas", subArea: "107", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
  { id: "ION-CUST-2024-0897", pop: "Jakarta Timur", area: "Tanah Merdeka", subArea: "86", status: "Connected", uplink: "Need Checking", notification: "Instability Reported", notificationClass: "text-amber-600 font-medium italic", uplinkColor: "bg-amber-500", uplinkTextClass: "text-amber-700 font-medium" },
  { id: "ION-CUST-2024-0898", pop: "Jakarta Timur", area: "Kranggan", subArea: "79", status: "Connected", uplink: "No Issue", notification: "-", uplinkColor: "bg-emerald-500" },
];

export function ActiveIncidentsTable() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return connections;
    const term = search.toLowerCase();
    return connections.filter(
      (c) =>
        c.pop.toLowerCase().includes(term) ||
        c.area.toLowerCase().includes(term) ||
        c.subArea.includes(term) ||
        c.id.toLowerCase().includes(term),
    );
  }, [search]);

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="w-full md:max-w-xs space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Search Customer ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <Input
              className="pl-10"
              placeholder="Ex: CUST-12345..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button
                mode="icon"
                variant="ghost"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearch("")}
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-card rounded shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted">
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Connection Status Matrix</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Filter coming soon")}>
              <Filter className="size-4" /> Filter
            </Button>
            <Button variant="primary" size="sm" onClick={() => toast.info("Export coming soon")}>
              <Download className="size-4" /> Export
            </Button>
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
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
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
                      href={paths.dashboard.operations.connectivity.getHref(row.id)}
                      className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded transition-colors border border-blue-700/20"
                    >
                      WO Maintenance
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted">
          <span className="text-xs text-muted-foreground">
            Showing <b>{filtered.length}</b> of <b>{connections.length}</b> entries
          </span>
        </div>
      </div>
    </>
  );
}
