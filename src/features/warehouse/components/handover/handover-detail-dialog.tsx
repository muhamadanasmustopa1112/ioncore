"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  FileText,
  User,
  ShieldCheck,
  QrCode,
  Download,
  Fingerprint,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWarehouseStore } from "../../store/warehouse";

export function HandoverDetailDialog() {
  const {
    selectedWorkOrderId,
    setSelectedWorkOrderId,
    workOrders,
    setHandoverDialogOpen,
    handoverRecords,
  } = useWarehouseStore();

  const [downloading, setDownloading] = useState(false);

  if (!selectedWorkOrderId) return null;

  const wo = workOrders.find((w) => w.id === selectedWorkOrderId);
  if (!wo) return null;

  const isCompleted = wo.status === "Completed";
  const record = handoverRecords.find((r) => r.workOrderId === wo.id);

  const handleStartHandover = () => {
    setSelectedWorkOrderId(null);
    setHandoverDialogOpen(true);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Handover Slip ${wo.id} downloaded successfully!`);
    }, 1500);
  };

  return (
    <Dialog
      open={!!selectedWorkOrderId}
      onOpenChange={(open) => {
        if (!open) setSelectedWorkOrderId(null);
      }}
    >
      <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-2xl border border-slate-100 dark:border-slate-800">
        {/* Header Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                Work Order Details
              </span>
              <DialogTitle className="text-2xl font-extrabold mt-2 tracking-tight text-white">
                {wo.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100 mt-1">
                Issued on {wo.dateCreated} • Status: {isCompleted ? "Completed (Circulating)" : "Pending (Goods Ready)"}
              </DialogDescription>
            </div>
            <button
              onClick={() => setSelectedWorkOrderId(null)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="size-4" />
            </button>
          </div>
          {/* Wave Decorator */}
          <div className="absolute right-0 bottom-0 opacity-10">
            <Fingerprint className="size-32 translate-x-8 translate-y-8" />
          </div>
        </div>

        <DialogBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Step Timeline Indicator */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
              <div>
                <p className="text-xs font-bold">1. Order Assigned</p>
                <p className="text-[10px] text-slate-400">Assigned to technician</p>
              </div>
            </div>
            <div className="h-0.5 flex-1 bg-emerald-500 max-w-[40px]" />
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
              <div>
                <p className="text-xs font-bold">2. Prepared</p>
                <p className="text-[10px] text-slate-400">Verified by warehouse</p>
              </div>
            </div>
            <div className={`h-0.5 flex-1 max-w-[40px] ${isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
            <div className="flex items-center gap-2.5">
              {isCompleted ? (
                <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
              ) : (
                <Clock className="size-5 text-amber-500 animate-pulse" />
              )}
              <div>
                <p className="text-xs font-bold">3. Handover</p>
                <p className="text-[10px] text-slate-400">{isCompleted ? "Success Pick-up" : "Pending Signature"}</p>
              </div>
            </div>
          </div>

          {/* Technician Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Assigned Technician
              </span>
              <div className="flex items-center gap-3">
                <Avatar className="size-10 ring-2 ring-primary/10">
                  <AvatarImage src={wo.avatarUrl} alt={wo.technicianName} />
                  <AvatarFallback className="text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                    {wo.technicianName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {wo.technicianName}
                  </h4>
                  <p className="text-xs text-slate-500">{wo.technicianRole}</p>
                </div>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Security Dispatch Hash
              </span>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Fingerprint className="size-5 text-indigo-500" />
                <span className="text-xs font-mono tracking-tight text-slate-400 block truncate">
                  {isCompleted
                    ? `SHA256: 8f4c${wo.id.replace(/-/g, "").toLowerCase()}d28a9b3`
                    : "Awaiting final signature signature..."}
                </span>
              </div>
            </div>
          </div>

          {/* Allocated Materials */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Allocated Materials List
            </span>
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-[9px]">Material</th>
                    <th className="px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-[9px] text-center">Qty</th>
                    <th className="px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-[9px]">Serial Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {wo.equipmentList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      </td>
                      <td className="px-4 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {item.qty} {item.uom}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">
                        {item.serial || <span className="text-slate-300 dark:text-slate-700">Non-Serialized</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Verification (Completed) */}
          {isCompleted && (
            <div className="space-y-2.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Dual Signatures Proof of Handover
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between h-36 bg-slate-50/30 dark:bg-slate-900/30 relative overflow-hidden">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block self-start">Technician</span>
                  <div className="h-16 flex items-center justify-center">
                    {record?.technicianSignature ? (
                      <img src={record.technicianSignature} alt="Technician Sign" className="h-full object-contain filter dark:invert" />
                    ) : (
                      <div className="italic text-slate-300 text-xs font-mono font-bold line-through tracking-widest">BUDI SANTOSO</div>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 font-medium self-start block mt-1">Verified via Mobile OTP</span>
                </div>

                <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between h-36 bg-slate-50/30 dark:bg-slate-900/30 relative overflow-hidden">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block self-start">Warehouse Manager</span>
                  <div className="h-16 flex items-center justify-center">
                    {record?.warehouseSignature ? (
                      <img src={record.warehouseSignature} alt="Warehouse Sign" className="h-full object-contain filter dark:invert" />
                    ) : (
                      <div className="italic text-slate-300 text-xs font-mono font-bold border-b border-dashed border-slate-400 pb-1">ALEX THOMPSON</div>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 font-medium self-start block mt-1">Verified via Biometric HQ</span>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {isCompleted ? (
            <>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                This document is secure and synchronized.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWorkOrderId(null)}
                  className="font-bold text-xs"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="font-bold text-xs gap-2"
                >
                  <Download className="size-3.5" />
                  {downloading ? "Downloading..." : "Download Slip"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="size-3.5 text-amber-500 animate-pulse" />
                Awaiting dual-handover dispatch process.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWorkOrderId(null)}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartHandover}
                  className="font-bold text-xs gap-2 active:scale-95 transition-all shadow-md"
                >
                  <QrCode className="size-3.5" />
                  Launch Dispatch QR
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
