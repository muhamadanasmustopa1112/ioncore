"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { ScannerDialog } from "../../scanner/scanner-dialog";
import { ScanResultBadge } from "../../scanner/scan-result-badge";
import { matchScannedQR } from "../../../utils/qr-matcher";
import type { ScanResult } from "../../../hooks/use-qr-scanner";
import type { WarehouseAsset } from "../../../types";

const opnameSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
});

type OpnameFormValues = z.infer<typeof opnameSchema>;

export interface OpnameFormRef {
  submit: () => void;
  isPending: boolean;
}

interface OpnameFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const WAREHOUSES = [
  { id: "WH-001", name: "Gudang Jakarta Utara" },
  { id: "WH-002", name: "Gudang Bandung Utara" },
  { id: "WH-003", name: "Gudang Surabaya" },
];

export const OpnameForm = forwardRef<OpnameFormRef, OpnameFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { stockLevels, opnames, updateOpnameCount, serializedAssets, assets } = useWarehouseStore();

    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannedItems, setScannedItems] = useState<Map<string, number>>(new Map());

    const handleOpnameScan = (result: ScanResult) => {
      const match = matchScannedQR(result.text, serializedAssets, stockLevels, assets);
      if (match.type === "asset" && match.data) {
        const asset = match.data as WarehouseAsset;
        setScannedItems((prev) => {
          const next = new Map(prev);
          const current = next.get(asset.id) || 0;
          next.set(asset.id, current + 1);
          return next;
        });
      }
    };

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    } = useForm<OpnameFormValues>({
      resolver: zodResolver(opnameSchema),
      defaultValues: { warehouseId: "WH-001" },
    });

    const warehouseId = watch("warehouseId");

    const warehouseStock = useMemo(() => {
      return stockLevels.filter((sl) => sl.warehouseId === warehouseId);
    }, [stockLevels, warehouseId]);

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: OpnameFormValues) {
      const warehouse = WAREHOUSES.find((w) => w.id === values.warehouseId);
      if (!warehouse) return;

      opnames.push({
        id: `OPN-${Date.now()}`,
        warehouseId: values.warehouseId,
        warehouseName: warehouse.name,
        status: "in_progress",
        scheduledDate: new Date().toISOString().split("T")[0],
        startedAt: new Date().toISOString(),
        initiatedBy: "USR-001",
        initiatedByName: "Admin",
        items: warehouseStock.map((sl) => ({
          stockItemId: sl.stockItemId,
          stockItemName: sl.stockItemName,
          stockItemSku: sl.stockItemSku,
          itemType: sl.stockItemType,
          uom: sl.uom,
          systemCount: sl.currentStock,
          countedCount: null,
          variance: 0,
          status: "pending",
        })),
        totalDiscrepancies: 0,
      });
      onSuccess();
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.warehouseLabel", "Warehouse")} *
          </label>
          <select
            {...register("warehouseId")}
            disabled={isReadOnly}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {WAREHOUSES.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
          </select>
          {errors.warehouseId && <p className="text-[10px] text-destructive font-bold">{errors.warehouseId.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.stockItems", "Stock Items")} ({warehouseStock.length})
            </span>
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setScannerOpen(true)}
              >
                <QrCode className="size-3.5" />
                Scan Items
              </Button>
            )}
          </div>

          {scannedItems.size > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground">Scanned Items ({scannedItems.size})</p>
              {Array.from(scannedItems.entries()).map(([id, count]) => {
                const asset = serializedAssets.find((a) => a.id === id);
                return asset ? (
                  <ScanResultBadge
                    key={id}
                    success
                    label={asset.name}
                    value={`${count} scanned`}
                  />
                ) : null;
              })}
            </div>
          )}

          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">{t("common.name", "Item")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">{t("warehouse.systemCount", "System")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">{t("warehouse.alertStatus", "Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseStock.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs">
                      <div className="font-medium">{item.stockItemName}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{item.stockItemSku}</div>
                    </TableCell>
                    <TableCell className="text-xs font-bold">{item.currentStock} {item.uom}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.alertStatus === "Critical" ? "destructive" : item.alertStatus === "Warning" ? "warning" : "success"}
                        appearance="light"
                        className="text-[9px]"
                      >
                        {item.alertStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {warehouseStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-6">
                      {t("warehouse.noStockItems", "No stock items for this warehouse.")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <ScannerDialog
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleOpnameScan}
          title="Scan Item for Physical Count"
        />
      </div>
    );
  }
);

OpnameForm.displayName = "OpnameForm";
