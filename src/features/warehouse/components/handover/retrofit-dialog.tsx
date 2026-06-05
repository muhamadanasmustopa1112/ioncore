"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  CheckCircle,
  Plus,
  Trash2,
  Cpu,
  Info,
  Layers,
  ArrowRight,
  ClipboardList,
  QrCode,
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
import { Input } from "@/components/ui/input";
import { useWarehouseStore } from "../../store/warehouse";
import { toast } from "sonner";
import { ScannerDialog } from "../scanner/scanner-dialog";
import { ScanResultBadge } from "../scanner/scan-result-badge";
import { matchScannedQR } from "../../utils/qr-matcher";
import type { ScanResult } from "../../hooks/use-qr-scanner";
import type { WarehouseAsset } from "../../types";

export function RetrofitDialog() {
  const {
    retrofitDialogOpen,
    setRetrofitDialogOpen,
    serializedAssets,
    addRetrofitJob,
  } = useWarehouseStore();

  const [step, setStep] = useState<1 | 2>(1);

  // QR Scanner states
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<"component1" | "component2" | null>(null);

  // Form states
  const [component1Id, setComponent1Id] = useState("");
  const [component1Role, setComponent1Role] = useState("Chassis & Case");
  
  const [component2Id, setComponent2Id] = useState("");
  const [component2Role, setComponent2Role] = useState("Logic Board module");

  const [resultName, setResultName] = useState("Huawei HG8145V5 Retrofit");
  const [resultSku, setResultSku] = useState("HW-ONT-992-RFT");
  const [resultSerial, setResultSerial] = useState("");
  const [woNumber, setWoNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Get defective assets available for cannibalization
  const defectiveAssets = serializedAssets.filter(
    (asset) => asset.status === "defective"
  );

  const selectedAsset1 = defectiveAssets.find((a) => a.id === component1Id);
  const selectedAsset2 = defectiveAssets.find((a) => a.id === component2Id);

  const handleRetrofitScan = (result: ScanResult) => {
    const match = matchScannedQR(result.text, serializedAssets, [], []);
    if (match.type === "asset" && match.data) {
      const asset = match.data as WarehouseAsset;
      if (asset.status === "defective" || asset.status === "under_maintenance") {
        if (scannerTarget === "component1") {
          setComponent1Id(asset.id);
        } else if (scannerTarget === "component2") {
          setComponent2Id(asset.id);
        }
      }
    }
    setScannerTarget(null);
  };

  // Auto-fill result details if source components are selected
  useEffect(() => {
    if (selectedAsset1 && !resultSerial) {
      setResultSerial(`SN-RTF-${selectedAsset1.serialNumber.replace("SN-", "")}`);
    }
  }, [component1Id, selectedAsset1]);

  const handleAssemble = (e: React.FormEvent) => {
    e.preventDefault();
    if (!component1Id || !component2Id) {
      toast.error("Please select two defective components to cannibalize!");
      return;
    }
    if (component1Id === component2Id) {
      toast.error("Source components must be distinct physical assets!");
      return;
    }
    if (!resultName || !resultSku) {
      toast.error("Resulting asset Name and SKU are required!");
      return;
    }

    const comp1 = defectiveAssets.find((a) => a.id === component1Id)!;
    const comp2 = defectiveAssets.find((a) => a.id === component2Id)!;

    addRetrofitJob({
      resultAssetSku: resultSku,
      resultAssetName: resultName,
      resultAssetSerial: resultSerial,
      woNumber: woNumber || undefined,
      notes: notes || `Retrofit assembly from ${comp1.name} and ${comp2.name}.`,
      components: [
        {
          sourceAssetId: comp1.id,
          sku: comp1.sku,
          name: comp1.name,
          serialNumber: comp1.serialNumber,
          componentRole: component1Role,
        },
        {
          sourceAssetId: comp2.id,
          sku: comp2.sku,
          name: comp2.name,
          serialNumber: comp2.serialNumber,
          componentRole: component2Role,
        },
      ],
    });

    toast.success("Retrofit Job completed! New asset registered.");
    setStep(2);
  };

  const handleClose = () => {
    setComponent1Id("");
    setComponent2Id("");
    setResultSerial("");
    setWoNumber("");
    setNotes("");
    setStep(1);
    setRetrofitDialogOpen(false);
  };

  return (
    <Dialog open={retrofitDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg w-full overflow-hidden flex flex-col rounded-2xl border border-slate-150 dark:border-slate-800">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="size-5 text-blue-700" />
            Asset Retrofit & Cannibalization
          </DialogTitle>
          <DialogDescription className="text-xs">
            Assemble a functional unit from defective parts. Defective components will be permanently marked as <strong>cannibalized</strong> in the database.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="py-4 overflow-y-auto max-h-[500px]">
          {step === 1 ? (
            <form onSubmit={handleAssemble} className="space-y-4 text-left">
              {/* Step context */}
              <div className="border border-blue-100 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/15 p-3.5 rounded-xl flex gap-3 items-start">
                <Info className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-500 leading-normal">
                  In compliance with inventory regulations, components harvested from defective items will be tagged. The newly assembled item will enter standard stock with <code>in_warehouse</code> status.
                </p>
              </div>

              {/* Source Components */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Select Defective Source Assets
                </span>

                {/* Component 1 */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Source Asset A *
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-medium"
                          value={component1Id}
                          onChange={(e) => setComponent1Id(e.target.value)}
                          required
                        >
                          <option value="">-- Select Defective Unit --</option>
                          {defectiveAssets
                            .filter((a) => a.id !== component2Id)
                            .map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name} ({a.serialNumber})
                              </option>
                            ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => { setScannerTarget("component1"); setScannerOpen(true); }}
                        >
                          <QrCode className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Role / Component Role *
                      </label>
                      <Input
                        type="text"
                        value={component1Role}
                        onChange={(e) => setComponent1Role(e.target.value)}
                        className="h-8 text-xs font-semibold"
                        placeholder="e.g. Case & Chassis"
                        required
                      />
                    </div>
                  </div>
                  {component1Id && (
                    <ScanResultBadge
                      success
                      label="Component 1"
                      value={selectedAsset1?.serialNumber}
                    />
                  )}
                </div>

                {/* Component 2 */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Source Asset B *
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-medium"
                          value={component2Id}
                          onChange={(e) => setComponent2Id(e.target.value)}
                          required
                        >
                          <option value="">-- Select Defective Unit --</option>
                          {defectiveAssets
                            .filter((a) => a.id !== component1Id)
                            .map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name} ({a.serialNumber})
                              </option>
                            ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => { setScannerTarget("component2"); setScannerOpen(true); }}
                        >
                          <QrCode className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Role / Component Role *
                      </label>
                      <Input
                        type="text"
                        value={component2Role}
                        onChange={(e) => setComponent2Role(e.target.value)}
                        className="h-8 text-xs font-semibold"
                        placeholder="e.g. Logic Board module"
                        required
                      />
                    </div>
                  </div>
                  {component2Id && (
                    <ScanResultBadge
                      success
                      label="Component 2"
                      value={selectedAsset2?.serialNumber}
                    />
                  )}
                </div>
              </div>

              {/* Result Details */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Assembled Resulting Asset
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      New Item Name *
                    </label>
                    <Input
                      type="text"
                      value={resultName}
                      onChange={(e) => setResultName(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      New SKU Code *
                    </label>
                    <Input
                      type="text"
                      value={resultSku}
                      onChange={(e) => setResultSku(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Target Serial Number (Optional)
                    </label>
                    <Input
                      type="text"
                      value={resultSerial}
                      onChange={(e) => setResultSerial(e.target.value)}
                      placeholder="e.g. SN-HUA992-RFT-01"
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Work Order Reference (Optional)
                    </label>
                    <Input
                      type="text"
                      value={woNumber}
                      onChange={(e) => setWoNumber(e.target.value)}
                      placeholder="e.g. WO-2026-RFT001"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Retrofit Session Notes *
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how the components are matched..."
                    className="w-full text-xs p-2.5 bg-background border border-slate-200 dark:border-slate-800 rounded-lg resize-none"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4 font-semibold text-xs"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="h-10 px-5 font-semibold text-xs shadow-md gap-1.5"
                  disabled={!component1Id || !component2Id}
                >
                  <Wrench className="size-4" />
                  Perform Assembly
                </Button>
              </div>
            </form>
          ) : (
            /* STEP 2: Success Receipt */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full text-emerald-500 animate-bounce">
                <CheckCircle className="size-14" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Retrofit Assembly Completed
                </h3>
                <p className="text-xs text-slate-400">
                  New operational item has been added to warehouse stock, and source components have been marked as cannibalized.
                </p>
              </div>

              <div className="w-full border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Assembled Asset</span>
                  <span className="font-bold text-slate-800 dark:text-white">{resultName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Serial Number</span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{resultSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">SKU Code</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{resultSku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Valuation Cost</span>
                  <span className="font-semibold text-emerald-600">IDR 350.000,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase">
                    IN STOCK (In Warehouse)
                  </span>
                </div>
              </div>

              <Button
                onClick={handleClose}
                variant="primary"
                className="w-full h-11 text-xs font-semibold shadow-md"
              >
                Close Portal
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>

      <ScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScan={handleRetrofitScan}
        title={scannerTarget === "component1" ? "Scan Component 1" : "Scan Component 2"}
      />
    </Dialog>
  );
}
