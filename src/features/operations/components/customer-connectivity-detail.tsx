"use client";
import Link from "next/link";
import { Search, MapPin, FileText, Router, Users, Activity, X, Plus, Minus, Archive, ShieldAlert } from "lucide-react";
import { paths } from "@/config/paths";
export function CustomerConnectivityDetail({ incidentId }: { incidentId: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md overflow-y-auto py-10 px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-outline flex flex-col min-h-[800px]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-outline flex justify-between items-center bg-surface-variant dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Customer Connectivity Detail</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider">REF ID: {incidentId}</p>
            </div>
          </div>
          <Link 
            href={paths.dashboard.operations.root.getHref()}
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-on-surface transition-colors"
          >
            <X className="size-5" />
          </Link>
        </div>
        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-outline overflow-hidden">
          {/* Left Panel */}
          <div className="flex-1 p-8 space-y-8 overflow-y-auto h-full max-h-[700px]">
            {/* Critical Alert */}
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 rounded-xl p-5 flex items-center gap-5 shadow-sm">
              <div className="size-14 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 animate-pulse shadow-lg shadow-red-200 dark:shadow-red-900/20">
                <ShieldAlert className="size-8" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-red-700 dark:text-red-400 tracking-tight leading-none mb-1">
                  CRITICAL: FO CUT DETECTED
                </h4>
                <p className="text-xs font-semibold text-red-600/80 dark:text-red-400/80">
                  Optical Power Level: -40dBm (No Signal) • Detected at 14:22 WIB
                </p>
              </div>
              <div className="hidden sm:block">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-sm">
                  Emergency Dispatch
                </button>
              </div>
            </div>
            {/* Customer Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-variant dark:bg-slate-800 border border-outline rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Customer Name</p>
                <p className="text-lg font-bold text-on-surface">Ahmad Sulaiman</p>
                <p className="text-xs text-primary font-medium mt-1">Premium Home Fiber (100Mbps)</p>
              </div>
              <div className="p-4 bg-surface-variant dark:bg-slate-800 border border-outline rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Customer ID</p>
                <p className="text-lg font-bold text-on-surface">{incidentId}</p>
                <p className="text-xs text-slate-500 mt-1">Joined: March 12, 2024</p>
              </div>
            </div>
            {/* Installation Address */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-outline rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-4 text-slate-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alamat Pemasangan</p>
              </div>
              <p className="text-sm font-medium text-on-surface leading-relaxed">
                Cluster Mutiara Blok B2, No. 12A, Condet, Kramat Jati, Jakarta Timur, 13520
              </p>
              <div className="mt-4 aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg border border-outline overflow-hidden relative group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  src="https://maps.google.com/maps?q=-6.2842,106.8531&hl=en&z=15&output=embed"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded shadow-sm border border-outline">
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">LAT: -6.2842 • LON: 106.8531</p>
                </div>
              </div>
            </div>
            {/* Billing Address */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-outline rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="size-4 text-slate-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Billing Address</p>
              </div>
              <p className="text-sm text-slate-600">Same as installation address</p>
            </div>
          </div>
          {/* Right Panel */}
          <div className="w-full md:w-[380px] bg-surface-variant dark:bg-slate-800 p-8 space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Infrastructure Hierarchy</p>
              <div className="space-y-3">
                {/* POP */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-outline rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">POP Central</p>
                    <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded border border-emerald-100 dark:border-emerald-900 uppercase">Active</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">POP-CON-01</p>
                  <p className="text-xs text-slate-500 mt-1">Condet Central Hub</p>
                </div>
                
                {/* ODP */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-outline rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Access Node (ODP)</p>
                    <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[9px] font-bold rounded border border-red-100 dark:border-red-900 uppercase">Issue</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">ODP-CDT-012</p>
                  <p className="text-xs text-slate-500 mt-1">Port 08 • Splitter 1:8</p>
                </div>
                {/* ONT */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-outline rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subscriber Unit (ONT)</p>
                    <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[9px] font-bold rounded border border-red-100 dark:border-red-900 uppercase">Offline</span>
                  </div>
                  <p className="text-xs font-mono font-medium text-on-surface bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-outline-variant inline-block mt-1">ZNID2424-A1B2C3D4</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Rx Power</p>
                      <p className="text-xs font-bold text-red-600">-40.0 dBm</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Uptime</p>
                      <p className="text-xs font-bold text-on-surface">0s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-outline flex flex-col gap-3">
              <button className="w-full bg-primary text-white px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3">
                <span className="flex items-center gap-2">
                  <Archive className="size-5" />
                  <span>Create ADDITIONAL<br/>WO Maintenance</span>
                </span>
              </button>
              <button className="w-full bg-white dark:bg-slate-900 border border-outline text-slate-600 dark:text-slate-400 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <span className="flex items-center gap-2">
                  <Activity className="size-5" />
                  View Ticket History
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
