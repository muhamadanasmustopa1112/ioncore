"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Barcode,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWarehouseStore } from "../../store/warehouse";
import { SignaturePad } from "./signature-pad";
import { WorkOrder } from "../../types";
import { ScannerDialog } from "../scanner/scanner-dialog";
import { ScanResultBadge } from "../scanner/scan-result-badge";
import { matchScannedQR } from "../../utils/qr-matcher";
import type { ScanResult } from "../../hooks/use-qr-scanner";

const AVAILABLE_SERIAL_NUMBERS = [
  "SN-HUA99210-JAK",
  "SN-HUA99211-BDG",
  "SN-HUA99212-SUB",
  "SN-HUA99213-MDN",
  "SN-HUA99214-YOG",
];

export function HandoverDialog() {
  const {
    handoverDialogOpen,
    setHandoverDialogOpen,
    workOrders,
    completeWorkOrder,
    addHandoverRecord,
    assets,
    serializedAssets,
    stockLevels,
  } = useWarehouseStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  // Desktop Barcode/QR Scanning simulation states (Scanning physical items and badges at the desk)
  const [ontScanned, setOntScanned] = useState(false);
  const [serialScanned, setSerialScanned] = useState(false);
  const [idScanned, setIdScanned] = useState(false);
  const [scannedSerial, setScannedSerial] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // QR Scanner states
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<"ont" | "serial" | "id" | null>(null);
  const [scannedOntValue, setScannedOntValue] = useState("");
  const [scannedSerialValue, setScannedSerialValue] = useState("");
  const [scannedIdValue, setScannedIdValue] = useState("");

  // Signature states
  const [techSign, setTechSign] = useState("");
  const [whSign, setWhSign] = useState("");
  const [handoverId, setHandoverId] = useState("");

  useEffect(() => {
    if (handoverDialogOpen) {
      setCurrentTime(new Date().toLocaleString());
    }
  }, [handoverDialogOpen, step]);

  const pendingWOList = workOrders.filter((wo) => wo.status === "Pending");

  const handleSelectWO = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setStep(2); // Direct to step 2: Picking list verification & physical items scanning
  };

  const handleScanResult = (result: ScanResult) => {
    if (scannerTarget === "ont") {
      const match = matchScannedQR(result.text, serializedAssets, stockLevels, assets);
      if (match.type === "asset" || match.type === "stock_item") {
        setScannedOntValue(result.text);
        setOntScanned(true);
      }
    } else if (scannerTarget === "serial") {
      setScannedSerialValue(result.text);
      setScannedSerial(result.text);
      setSerialScanned(true);
    } else if (scannerTarget === "id") {
      setScannedIdValue(result.text);
      setIdScanned(true);
    }
    setScannerTarget(null);
  };

  const handleScanONT = () => {
    setScannerTarget("ont");
    setScannerOpen(true);
  };

  const handleScanSerial = () => {
    setScannerTarget("serial");
    setScannerOpen(true);
  };

  const handleScanIDCard = () => {
    setScannerTarget("id");
    setScannerOpen(true);
  };

  const handleAssignONT = () => {
    // Flowchart: Assign ONT to Work Order Number
    // Move to digital signatures & asset registry deduction
    setStep(3);
  };

  const handleSubmitHandover = () => {
    if (!selectedWO) return;
    if (!techSign || !whSign) {
      alert("Both signatures are required for confirmation!");
      return;
    }

    // Flowchart: Update Asset Registry (Deduct from store stock)
    selectedWO.equipmentList.forEach((eq) => {
      const asset = assets.find((a) => a.sku === eq.sku);
      if (asset) {
        asset.units = Math.max(0, asset.units - eq.qty);
      }
    });

    addHandoverRecord({
      workOrderId: selectedWO.id,
      technicianName: selectedWO.technicianName,
      technicianSignature: techSign,
      warehouseSignature: whSign,
    });

    completeWorkOrder(selectedWO.id, scannedSerial);
    setHandoverId(`HND-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(4); // Move to completion receipt screen
  };

  const resetDialog = () => {
    setStep(1);
    setSelectedWO(null);
    setOntScanned(false);
    setSerialScanned(false);
    setIdScanned(false);
    setScannedSerial("");
    setTechSign("");
    setWhSign("");
    setScannerOpen(false);
    setScannerTarget(null);
    setScannedOntValue("");
    setScannedSerialValue("");
    setScannedIdValue("");
    setHandoverDialogOpen(false);
  };

  return (
    <Dialog
      open={handoverDialogOpen}
      onOpenChange={(open) => {
        if (!open) resetDialog();
        else setHandoverDialogOpen(true);
      }}
    >
      <DialogContent className="sm:max-w-md w-full overflow-hidden flex flex-col rounded-2xl border border-slate-150 dark:border-slate-800">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Barcode className="size-5 text-blue-700" />
            Equipment Handover Portal
          </DialogTitle>
          <DialogDescription className="text-xs">
            {step === 1 && "Select a pending Work Order to begin scanning physical materials."}
            {step === 2 && "Scan physical item QR codes, Serial Numbers, and your Officer ID."}
            {step === 3 && "Provide digital signatures to authorize dispatch and update stock levels."}
            {step === 4 && "Handover completed! Stock levels updated in the Asset Registry."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="py-4 overflow-y-auto max-h-[480px] space-y-4">
          {/* STEP 1: Select Work Order */}
          {step === 1 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Pending Work Orders ({pendingWOList.length})
              </span>
              {pendingWOList.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <CheckCircle className="size-10 text-green-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">All handovers completed</p>
                  <p className="text-[10px] text-slate-400">There are no pending dispatches awaiting scanning currently.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingWOList.map((wo) => (
                    <div
                      key={wo.id}
                      onClick={() => handleSelectWO(wo)}
                      className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl hover:bg-slate-50/60 dark:hover:bg-slate-900/20 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-900 group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={wo.avatarUrl} alt={wo.technicianName} />
                          <AvatarFallback className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                            {wo.technicianName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{wo.technicianName}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5 font-mono">{wo.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-700 transition-colors">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{wo.equipmentList.length} items</span>
                        <ChevronRight className="size-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Desktop Physical Barcode / QR Code Scanning Interface */}
          {step === 2 && selectedWO && (
            <div className="space-y-4">
              {/* Header Context */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Work Order Reference</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedWO.id}</p>
                <p className="text-xs text-slate-500">Technician: {selectedWO.technicianName} ({selectedWO.technicianRole})</p>
              </div>

              {/* Items pending scanning info */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-blue-50/30 dark:bg-blue-950/10 flex gap-3 items-start">
                <Info className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left text-[11px] text-slate-500 leading-normal">
                  Use your handheld barcode/QR-code scanner connected to the terminal to scan the goods, device Serial Number, and your Officer ID card.
                </div>
              </div>

              {/* Sequential Scanners */}
              <div className="space-y-2.5">
                <button
                  onClick={handleScanONT}
                  className={`w-full flex items-center justify-between p-3 border.5 rounded-xl text-left transition-all duration-300 ${ontScanned
                    ? "bg-emerald-50/40 border-emerald-500 text-emerald-700 dark:bg-emerald-900/10"
                    : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-blue-400"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${ontScanned ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}>
                      {ontScanned ? "✓" : "1"}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Scan ONT QR Code on Box</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Verifies product SKU {selectedWO.equipmentList[0]?.sku}</span>
                    </div>
                  </div>
                  {ontScanned && <span className="text-[10px] font-bold text-emerald-600 uppercase">Scanned</span>}
                </button>
                {scannedOntValue && <ScanResultBadge success label="ONT QR" value={scannedOntValue} />}

                {ontScanned && !serialScanned ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Serial Number from Stock</span>
                    <select
                      className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 font-mono font-bold text-blue-700 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={scannedSerial}
                      onChange={(e) => {
                        if (e.target.value) {
                          setScannedSerial(e.target.value);
                          setSerialScanned(true);
                        }
                      }}
                    >
                      <option value="">-- Choose Serial from Warehouse Stock --</option>
                      {AVAILABLE_SERIAL_NUMBERS.map((sn) => (
                        <option key={sn} value={sn}>{sn}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <button
                    onClick={handleScanSerial}
                    disabled={!ontScanned}
                    className={`w-full flex items-center justify-between p-3 border.5 rounded-xl text-left transition-all duration-300 ${serialScanned
                      ? "bg-emerald-50/40 border-emerald-500 text-emerald-700 dark:bg-emerald-900/10"
                      : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-blue-400 disabled:opacity-40 disabled:pointer-events-none"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${serialScanned ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}>
                        {serialScanned ? "✓" : "2"}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">Scan ONT Serial Number Barcode</span>
                        {scannedSerial ? (
                          <span className="text-[9px] font-mono text-emerald-600 block mt-0.5 font-bold">{scannedSerial}</span>
                        ) : (
                          <span className="text-[9px] text-slate-400 block mt-0.5">Scans physical barcode sticker on device</span>
                        )}
                      </div>
                    </div>
                    {serialScanned && <span className="text-[10px] font-bold text-emerald-600 uppercase">Captured</span>}
                  </button>
                )}
                {scannedSerialValue && <ScanResultBadge success label="Serial Number" value={scannedSerialValue} />}

                <button
                  onClick={handleScanIDCard}
                  disabled={!serialScanned}
                  className={`w-full flex items-center justify-between p-3 border.5 rounded-xl text-left transition-all duration-300 ${idScanned
                    ? "bg-emerald-50/40 border-emerald-500 text-emerald-700 dark:bg-emerald-900/10"
                    : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-blue-400 disabled:opacity-40 disabled:pointer-events-none"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${idScanned ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}>
                      {idScanned ? "✓" : "3"}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Scan ID Card Warehouse Officer</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Authorizes the material dispatch</span>
                    </div>
                  </div>
                  {idScanned && <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified</span>}
                </button>
                {scannedIdValue && <ScanResultBadge success label="Officer ID" value={scannedIdValue} />}
              </div>

              {/* Timestamp & GEO Tagging Info Panel */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-[11px] grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Timestamp Log</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{currentTime}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block flex items-center gap-1">
                    <MapPin className="size-3 text-red-500" />
                    GEO Tagging (HQ)
                  </span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">-6.2088° S, 106.8456° E</p>
                </div>
              </div>

              <Button
                onClick={handleAssignONT}
                disabled={!idScanned}
                variant="primary"
                className="w-full h-11 font-bold text-xs shadow-md gap-2"
              >
                Assign ONT to Work Order Number
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          )}

          {/* STEP 3: Dual Signatures Authorization (Right on the desk screen/tablet) */}
          {step === 3 && selectedWO && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Final Dual Digital Signature Authorization
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SignaturePad
                  label={`Technician: ${selectedWO.technicianName}`}
                  onSave={setTechSign}
                />
                <SignaturePad
                  label="Warehouse Officer"
                  onSave={setWhSign}
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-1/3 h-10 text-xs font-bold"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitHandover}
                  variant="primary"
                  className="w-2/3 h-10 text-xs font-bold shadow-md gap-1.5"
                  disabled={!techSign || !whSign}
                >
                  <ShieldCheck className="size-4" />
                  Approve & Update Registry
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Success confirmation */}
          {step === 4 && selectedWO && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full text-emerald-500 animate-pulse">
                <CheckCircle className="size-14" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Registry Updated Successfully</h3>
                <p className="text-xs text-slate-400">Device assigned and warehouse stock levels decremented in real-time.</p>
              </div>

              <div className="w-full border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Handover ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{handoverId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Work Order Number</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedWO.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Assigned Serial Number</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{scannedSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Timestamp</span>
                  <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                    <Clock className="size-3.5 text-blue-700" />
                    {currentTime}
                  </span>
                </div>
              </div>

              <Button
                onClick={resetDialog}
                variant="primary"
                className="w-full h-11 text-xs font-semibold shadow-md"
              >
                Close Handover Portal
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>

      <ScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScan={handleScanResult}
        title={
          scannerTarget === "ont" ? "Scan ONT QR Code" :
          scannerTarget === "serial" ? "Scan Serial Number" :
          "Scan Officer ID Card"
        }
      />
    </Dialog>
  );
}
