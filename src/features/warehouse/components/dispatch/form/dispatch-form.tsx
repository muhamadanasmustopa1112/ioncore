"use client";

import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { BOM_TEMPLATES, WO_TYPE_OPTIONS } from "@/features/warehouse/data/bom-templates";
import { generateBomItems, checkStockAvailability } from "@/features/warehouse/utils/bom-generator";
import type { DispatchBomItem } from "@/features/warehouse/types";

const dispatchSchema = z.object({
  woNumber: z.string().min(3, "WO number is required"),
  woType: z.string().min(1, "WO type is required"),
  technicianName: z.string().min(2, "Technician name is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
});

type DispatchFormValues = z.infer<typeof dispatchSchema>;

export interface DispatchFormRef {
  submit: () => void;
  isPending: boolean;
}

interface DispatchFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

export const DispatchForm = forwardRef<DispatchFormRef, DispatchFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { dispatches, updateDispatchStatus, stockLevels, serializedAssets } = useWarehouseStore();

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<DispatchFormValues>({
      resolver: zodResolver(dispatchSchema),
      defaultValues: { woType: "Installation", technicianName: "", warehouseId: "WH-001", woNumber: "" },
    });

    const woType = watch("woType");
    const warehouseId = watch("warehouseId");

    const bomItems = useMemo<DispatchBomItem[]>(() => {
      return generateBomItems(woType);
    }, [woType]);

    const stockChecks = useMemo(() => {
      return checkStockAvailability(bomItems, warehouseId, stockLevels);
    }, [bomItems, warehouseId, stockLevels]);

    const allStockAvailable = stockChecks.every((c) => c.available);

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: DispatchFormValues) {
      const newDispatch = {
        id: `DSP-${Date.now()}`,
        woNumber: values.woNumber,
        woType: values.woType,
        technicianId: "TECH-001",
        technicianName: values.technicianName,
        technicianRole: "Engineer",
        warehouseId: values.warehouseId,
        warehouseName: "Gudang Jakarta Utara",
        status: "pending" as const,
        dateCreated: new Date().toISOString(),
        items: bomItems,
      };
      dispatches.push(newDispatch);
      onSuccess();
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
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
              {t("warehouse.woType", "WO Type")} *
            </label>
            <select
              {...register("woType")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {WO_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.technician", "Technician")} *
            </label>
            <Input {...register("technicianName")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.technicianName && <p className="text-[10px] text-destructive font-bold">{errors.technicianName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.warehouseLabel", "Warehouse")} *
            </label>
            <select
              {...register("warehouseId")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="WH-001">Gudang Jakarta Utara</option>
              <option value="WH-002">Gudang Bandung Utara</option>
              <option value="WH-003">Gudang Surabaya</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.billOfMaterials", "Bill of Materials")}
            </span>
            <Badge variant={allStockAvailable ? "success" : "destructive"} appearance="light" className="text-[9px]">
              {allStockAvailable ? <CheckCircle2 className="size-3 mr-1" /> : <AlertTriangle className="size-3 mr-1" />}
              {allStockAvailable ? "Stock OK" : "Stock Insufficient"}
            </Badge>
          </div>

          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">{t("common.name", "Item")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">{t("common.type", "Type")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">{t("warehouse.qtyRequired", "Qty")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">{t("common.status", "Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bomItems.map((item) => {
                  const check = stockChecks.find((c) => c.itemId === item.stockItemId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">
                        <div className="font-medium">{item.stockItemName}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{item.stockItemSku}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] uppercase">{item.itemType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold">{item.qtyRequired} {item.uom}</TableCell>
                      <TableCell>
                        {check && (
                          <Badge variant={check.available ? "success" : "destructive"} appearance="light" className="text-[9px]">
                            {check.available ? `${check.currentStock} avail` : `${check.currentStock}/${check.required}`}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {bomItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                      {t("warehouse.noBomItems", "No BOM items for this WO type.")}
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
);

DispatchForm.displayName = "DispatchForm";
