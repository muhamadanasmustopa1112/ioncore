"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/features/warehouse/api/get-categories";
import { useStartOpname } from "@/features/warehouse/api/post-opname-start";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { useAuthStore } from "@/store/auth-store";
import {
  buildStartOpnamePayload,
  generateOpnameSessionNumber,
} from "@/features/warehouse/utils/build-start-opname-payload";
import { ScannerDialog } from "../../scanner/scanner-dialog";
import { ScanResultBadge } from "../../scanner/scan-result-badge";
import { matchScannedQR } from "../../../utils/qr-matcher";
import type { ScanResult } from "../../../hooks/use-qr-scanner";
import type { WarehouseAsset } from "../../../types";

const startOpnameSchema = z
  .object({
    session_number: z.string().min(1, "Session number is required"),
    started_by: z.string().min(1, "Started by is required"),
    warehouse_id: z.number().min(1, "Warehouse is required"),
    scope: z.enum(["full", "category"]),
    scope_category_id: z.number().optional(),
  })
  .refine(
    (data) =>
      data.scope !== "category" ||
      (data.scope_category_id != null && data.scope_category_id > 0),
    {
      message: "Category is required for scoped opname",
      path: ["scope_category_id"],
    }
  );

type StartOpnameFormValues = z.infer<typeof startOpnameSchema>;

export interface OpnameFormRef {
  submit: () => void;
  isPending: boolean;
}

interface OpnameFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const SCOPE_OPTIONS = [
  { value: "full", label: "Full Warehouse" },
  { value: "category", label: "By Category" },
] as const;

const selectClassName =
  "flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";

export const OpnameForm = forwardRef<OpnameFormRef, OpnameFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const { stockLevels, serializedAssets, assets } = useWarehouseStore();
    const { data: categoriesResponse } = useCategories();
    const categories = categoriesResponse?.data ?? [];
    const { mutate: startOpnameSession, isPending } = useStartOpname({
      mutationConfig: { onSuccess: () => onSuccess() },
    });

    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannedItems, setScannedItems] = useState<Map<string, number>>(
      new Map()
    );

    const handleOpnameScan = (result: ScanResult) => {
      const match = matchScannedQR(
        result.text,
        serializedAssets,
        stockLevels,
        assets
      );
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
      setValue,
      formState: { errors },
    } = useForm<StartOpnameFormValues>({
      resolver: zodResolver(startOpnameSchema),
      defaultValues: {
        session_number: generateOpnameSessionNumber(),
        started_by: user?.id ?? "",
        warehouse_id: 1,
        scope: "full",
        scope_category_id: undefined,
      },
    });

    useEffect(() => {
      if (user?.id) {
        setValue("started_by", user.id);
      }
    }, [user?.id, setValue]);

    const warehouseId = watch("warehouse_id");
    const scope = watch("scope");

    const warehouseStock = useMemo(() => {
      return stockLevels.filter(
        (sl) => sl.warehouseId === String(warehouseId)
      );
    }, [stockLevels, warehouseId]);

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending,
    }));

    function onSubmit(values: StartOpnameFormValues) {
      startOpnameSession(
        buildStartOpnamePayload({
          ...values,
          started_by: values.started_by || user?.id || "",
        })
      );
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <input type="hidden" {...register("started_by")} />

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.sessionNumber", "Session Number")} *
          </label>
          <Input
            {...register("session_number")}
            disabled={isReadOnly}
            className="text-xs h-10 font-mono"
          />
          {errors.session_number && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.session_number.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.warehouseLabel", "Warehouse")} *
            </label>
            <select
              {...register("warehouse_id", { valueAsNumber: true })}
              disabled={isReadOnly}
              className={selectClassName}
            >
              {WAREHOUSE_OPTIONS.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
            {errors.warehouse_id && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.warehouse_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.opnameScope", "Scope")} *
            </label>
            <select
              {...register("scope")}
              disabled={isReadOnly}
              className={selectClassName}
            >
              {SCOPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.scope && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.scope.message}
              </p>
            )}
          </div>
        </div>

        {scope === "category" && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.category", "Category")} *
            </label>
            <select
              {...register("scope_category_id", { valueAsNumber: true })}
              disabled={isReadOnly}
              className={selectClassName}
            >
              <option value={0}>
                {t("warehouse.selectCategory", "Select category...")}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.scope_category_id && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.scope_category_id.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.stockItems", "Stock Items")} ({warehouseStock.length})
            </span>
            {!isReadOnly && mode === "new" && (
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
              <p className="text-[10px] font-bold text-muted-foreground">
                Scanned Items ({scannedItems.size})
              </p>
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
                  <TableHead className="text-[10px] font-bold uppercase">
                    {t("common.name", "Item")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">
                    {t("warehouse.systemCount", "System")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">
                    {t("warehouse.alertStatus", "Status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseStock.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs">
                      <div className="font-medium">{item.stockItemName}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">
                        {item.stockItemSku}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold">
                      {item.currentStock} {item.uom}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.alertStatus === "Critical"
                            ? "destructive"
                            : item.alertStatus === "Warning"
                              ? "warning"
                              : "success"
                        }
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
                    <TableCell
                      colSpan={3}
                      className="text-center text-xs text-muted-foreground py-6"
                    >
                      {t(
                        "warehouse.noStockItems",
                        "No stock items for this warehouse."
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
          onScan={handleOpnameScan}
          title="Scan Item for Physical Count"
        />
      </div>
    );
  }
);

OpnameForm.displayName = "OpnameForm";
