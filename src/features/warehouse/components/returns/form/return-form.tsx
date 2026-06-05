"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { ScannerDialog } from "../../scanner/scanner-dialog";
import { ScanResultBadge } from "../../scanner/scan-result-badge";
import { matchScannedQR } from "../../../utils/qr-matcher";
import type { ScanResult } from "../../../hooks/use-qr-scanner";
import type { WarehouseAsset } from "../../../types";

const returnSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  woNumber: z.string().min(3, "WO number is required"),
  customerName: z.string().min(2, "Customer name is required"),
  ownership: z.enum(["ion_owned", "leased", "customer_owned"]),
  warehouseId: z.string().min(1, "Warehouse is required"),
  condition: z.enum(["good", "damaged"]).optional(),
  notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

export interface ReturnFormRef {
  submit: () => void;
  isPending: boolean;
}

interface ReturnFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const ASSETS = [
  { id: "AST-001", name: "Huawei HG8145V5 ONT", serial: "SN-HUA99210", sku: "HW-ONT-992" },
  { id: "AST-002", name: "ZTE F609 GPON ONT", serial: "SN-ZTE40498", sku: "ZTE-ONT-404" },
  { id: "AST-003", name: "TP-Link AX3000 Router", serial: "SN-TPL3000-05", sku: "TPL-RT-3000" },
];

const WAREHOUSES = [
  { id: "WH-001", name: "Gudang Jakarta Utara" },
  { id: "WH-002", name: "Gudang Bandung Utara" },
  { id: "WH-003", name: "Gudang Surabaya" },
];

export const ReturnForm = forwardRef<ReturnFormRef, ReturnFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { deviceReturns, serializedAssets, stockLevels, assets } = useWarehouseStore();

    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannedDevice, setScannedDevice] = useState<{ name: string; serial: string } | null>(null);

    const handleDeviceScan = (result: ScanResult) => {
      const match = matchScannedQR(result.text, serializedAssets, stockLevels, assets);
      if (match.type === "asset" && match.data) {
        const asset = match.data as WarehouseAsset;
        setScannedDevice({ name: asset.name, serial: asset.serialNumber });
      }
    };

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<ReturnFormValues>({
      resolver: zodResolver(returnSchema),
      defaultValues: { assetId: "AST-001", woNumber: "", customerName: "", ownership: "ion_owned", warehouseId: "WH-001", condition: "good", notes: "" },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: ReturnFormValues) {
      const asset = ASSETS.find((a) => a.id === values.assetId);
      const warehouse = WAREHOUSES.find((w) => w.id === values.warehouseId);
      if (!asset || !warehouse) return;

      deviceReturns.push({
        id: `RET-${Date.now()}`,
        assetId: values.assetId,
        assetName: asset.name,
        assetSku: asset.sku,
        serialNumber: asset.serial,
        qrCode: `ION-ASSET-${Date.now()}`,
        woNumber: values.woNumber,
        woId: values.woNumber,
        customerName: values.customerName,
        customerId: "CUST-001",
        ownership: values.ownership,
        status: "pending_return",
        condition: values.condition,
        dateInitiated: new Date().toISOString(),
        warehouseId: values.warehouseId,
        warehouseName: warehouse.name,
        notes: values.notes,
      });
      onSuccess();
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.deviceName", "Device")} *
          </label>
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-2 h-8 text-xs gap-1.5"
              onClick={() => setScannerOpen(true)}
            >
              <QrCode className="size-3.5" />
              Scan Device QR
            </Button>
          )}
          <select
            {...register("assetId")}
            disabled={isReadOnly}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {ASSETS.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.name} ({asset.serial})</option>
            ))}
          </select>
          {errors.assetId && <p className="text-[10px] text-destructive font-bold">{errors.assetId.message}</p>}
          {scannedDevice && (
            <ScanResultBadge success label="Device" value={`${scannedDevice.name} (${scannedDevice.serial})`} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.woNumber", "WO Number")} *
            </label>
            <Input {...register("woNumber")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.woNumber && <p className="text-[10px] text-destructive font-bold">{errors.woNumber.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.customer", "Customer")} *
            </label>
            <Input {...register("customerName")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.customerName && <p className="text-[10px] text-destructive font-bold">{errors.customerName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.ownership", "Ownership")} *
            </label>
            <select
              {...register("ownership")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="ion_owned">ION Owned</option>
              <option value="leased">Leased</option>
              <option value="customer_owned">Customer Owned</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.condition", "Condition")}
            </label>
            <select
              {...register("condition")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.warehouseLabel", "Return Warehouse")} *
          </label>
          <select
            {...register("warehouseId")}
            disabled={isReadOnly}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {WAREHOUSES.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.notes", "Notes")}
          </label>
          <Textarea {...register("notes")} readOnly={isReadOnly} className="text-xs resize-none" rows={3} />
        </div>

        <ScannerDialog
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleDeviceScan}
          title="Scan Returned Device"
        />
      </div>
    );
  }
);

ReturnForm.displayName = "ReturnForm";
