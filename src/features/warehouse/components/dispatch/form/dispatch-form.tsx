"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Package, QrCode, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { useCreateDispatch } from "@/features/warehouse/api/post-dispatch";
import {
  buildCreateDispatchPayload,
  type DispatchItemFormLine,
  validateDispatchForm,
} from "@/features/warehouse/utils/build-dispatch-payload";
import { parseDispatchQr } from "@/features/warehouse/utils/parse-dispatch-qr";
import { ScannerDialog } from "../../scanner/scanner-dialog";
import { ScanResultBadge } from "../../scanner/scan-result-badge";
import type { ScanResult } from "../../../hooks/use-qr-scanner";
import { toast } from "sonner";

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const dispatchSchema = z.object({
  dispatch_number: z.string().min(1, "Dispatch number is required"),
  wo_id: z.string().min(1, "WO ID is required"),
  technician_user_id: z.string().min(1, "Technician is required"),
  source_warehouse_id: z.number().min(1, "Warehouse is required"),
});

type DispatchFormValues = z.infer<typeof dispatchSchema>;

type ScannerTarget = "technician" | "item";

export interface DispatchFormRef {
  submit: () => void;
  isPending: boolean;
}

interface DispatchFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

function DispatchDetailView() {
  const { t } = useTranslation();
  const { selectedDispatch } = useWarehouseStore();

  if (!selectedDispatch) {
    return (
      <div className="px-1 py-2 text-sm text-muted-foreground">
        {t("warehouse.noDispatchSelected", "No dispatch selected.")}
      </div>
    );
  }

  const dispatch = selectedDispatch;

  return (
    <div className="space-y-5 px-1 py-2 pb-6">
      <div className="space-y-1">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.dispatchNumber", "Dispatch Number")}
        </p>
        <p className="text-sm font-medium">{dispatch.dispatchNumber ?? "—"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.woNumber", "WO ID")}
          </p>
          <p className="text-sm font-medium">{dispatch.woNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("common.status", "Status")}
          </p>
          <Badge variant="info" appearance="light" className="text-[10px] uppercase">
            {dispatch.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.technician", "Technician")}
          </p>
          <p className="text-sm font-medium">{dispatch.technicianName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.warehouseLabel", "Warehouse")}
          </p>
          <p className="text-sm font-medium">{dispatch.warehouseName}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.dispatchItems", "Dispatch Items")}
          </span>
        </div>
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-bold uppercase">QR</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Stock Item</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatch.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-[10px] font-mono max-w-[120px] truncate">
                    {item.qrCodes?.[0] ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs">{item.stockItemId}</TableCell>
                  <TableCell className="text-xs font-bold">{item.qtyDispatched}</TableCell>
                </TableRow>
              ))}
              {dispatch.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-6">
                    {t("warehouse.noDispatchItems", "No items.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

export const DispatchForm = forwardRef<DispatchFormRef, DispatchFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { mutate: createDispatch, isPending } = useCreateDispatch();

    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannerTarget, setScannerTarget] = useState<ScannerTarget>("technician");
    const [scannedTechId, setScannedTechId] = useState<string | null>(null);
    const [items, setItems] = useState<DispatchItemFormLine[]>([]);
    const [itemsError, setItemsError] = useState<string | null>(null);

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<DispatchFormValues>({
      resolver: zodResolver(dispatchSchema),
      defaultValues: {
        dispatch_number: "",
        wo_id: "",
        technician_user_id: "",
        source_warehouse_id: 1,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending,
    }));

    function openScanner(target: ScannerTarget) {
      setScannerTarget(target);
      setScannerOpen(true);
    }

    function handleScan(result: ScanResult) {
      const text = result.text.trim();
      if (!text) return;

      if (scannerTarget === "technician") {
        setScannedTechId(text);
        setValue("technician_user_id", text, { shouldValidate: true });
        return;
      }

      const parsed = parseDispatchQr(text);
      setItems((prev) => [
        ...prev,
        {
          id: `item-${Date.now()}-${prev.length}`,
          qr_payload: parsed.qr_payload,
          kind: parsed.kind,
          stock_item_id: 0,
          work_order_material_id: 0,
          quantity: 1,
        },
      ]);
      setItemsError(null);
    }

    function updateItem(id: string, patch: Partial<DispatchItemFormLine>) {
      setItems((prev) =>
        prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
      );
    }

    function removeItem(id: string) {
      setItems((prev) => prev.filter((line) => line.id !== id));
    }

    function onSubmit(values: DispatchFormValues) {
      const validationError = validateDispatchForm(values, items);
      if (validationError) {
        setItemsError(validationError);
        toast.error(validationError);
        return;
      }

      setItemsError(null);
      const payload = buildCreateDispatchPayload(values, items);

      createDispatch(payload, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }

    if (mode === "details" || mode === "edit") {
      return <DispatchDetailView />;
    }

    return (
      <div className="space-y-5 px-1 py-2 pb-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.dispatchNumber", "Dispatch Number")} *
          </label>
          <Input
            {...register("dispatch_number")}
            placeholder="DSP-SIT-INSTALL-001"
            className="text-xs h-10"
          />
          {errors.dispatch_number && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.dispatch_number.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.woNumber", "WO ID")} *
            </label>
            <Input
              {...register("wo_id")}
              placeholder="WO-SIT-INSTALL-001"
              className="text-xs h-10"
            />
            {errors.wo_id && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.wo_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.warehouseLabel", "Warehouse")} *
            </label>
            <select
              {...register("source_warehouse_id", { valueAsNumber: true })}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {WAREHOUSE_OPTIONS.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
            {errors.source_warehouse_id && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.source_warehouse_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.technician", "Technician")} *
          </label>
          <div className="flex gap-2">
            <Input
              {...register("technician_user_id")}
              placeholder="tech-bks-001"
              className="text-xs h-10 flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 shrink-0"
              onClick={() => openScanner("technician")}
            >
              <QrCode className="size-4" />
            </Button>
          </div>
          {errors.technician_user_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.technician_user_id.message}
            </p>
          )}
          {scannedTechId && (
            <ScanResultBadge success label="Technician" value={scannedTechId} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("warehouse.dispatchItems", "Dispatch Items")} *
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[11px] font-semibold"
              onClick={() => openScanner("item")}
            >
              <QrCode className="size-3.5 mr-1.5" />
              {t("warehouse.scanItemQr", "Scan Item QR")}
            </Button>
          </div>

          {itemsError && (
            <p className="text-[10px] text-destructive font-bold">{itemsError}</p>
          )}

          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">Type</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">QR Payload</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Stock ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">WO Mat.</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Qty</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Asset/Batch</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {line.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[9px] font-mono max-w-[100px] truncate">
                      {line.qr_payload}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.stock_item_id || ""}
                        onChange={(e) =>
                          updateItem(line.id, {
                            stock_item_id: Number(e.target.value) || 0,
                          })
                        }
                        className="text-xs h-8 w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.work_order_material_id || ""}
                        onChange={(e) =>
                          updateItem(line.id, {
                            work_order_material_id: Number(e.target.value) || 0,
                          })
                        }
                        className="text-xs h-8 w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.quantity || ""}
                        onChange={(e) =>
                          updateItem(line.id, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                        className="text-xs h-8 w-14"
                      />
                    </TableCell>
                    <TableCell>
                      {line.kind === "batch" ? (
                        <Input
                          type="number"
                          placeholder="batch_id"
                          value={line.batch_id || ""}
                          onChange={(e) =>
                            updateItem(line.id, {
                              batch_id: Number(e.target.value) || undefined,
                            })
                          }
                          className="text-xs h-8 w-16"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="asset_id"
                          value={line.asset_id || ""}
                          onChange={(e) =>
                            updateItem(line.id, {
                              asset_id: Number(e.target.value) || undefined,
                            })
                          }
                          className="text-xs h-8 w-16"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        mode="icon"
                        className="size-7"
                        onClick={() => removeItem(line.id)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                      {t(
                        "warehouse.scanItemsHint",
                        "Scan item QR codes to add dispatch lines."
                      )}
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
          onScan={handleScan}
          title={
            scannerTarget === "technician"
              ? "Scan Technician ID"
              : "Scan Item QR Code"
          }
        />
      </div>
    );
  }
);

DispatchForm.displayName = "DispatchForm";
