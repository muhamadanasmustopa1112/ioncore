"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateReturn } from "@/features/warehouse/api/post-return";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { useAuthStore } from "@/store/auth-store";
import { buildCreateReturnPayload } from "@/features/warehouse/utils/build-create-return-payload";
import { ScannerDialog } from "../../scanner/scanner-dialog";
import { ScanResultBadge } from "../../scanner/scan-result-badge";
import { matchScannedQR } from "../../../utils/qr-matcher";
import type { ScanResult } from "../../../hooks/use-qr-scanner";
import type { WarehouseAsset } from "../../../types";

const returnSchema = z.object({
  wo_id: z.string().min(1, "WO ID is required"),
  asset_id: z.number().min(1, "Asset ID is required"),
  condition: z.string().min(1, "Condition is required"),
  disposition: z.string().min(1, "Disposition is required"),
  received_warehouse_id: z.number().min(1, "Warehouse is required"),
  actor: z.string().min(1, "Actor is required"),
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

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const CONDITION_OPTIONS = ["GOOD", "DAMAGED"] as const;

const DISPOSITION_OPTIONS = [
  "REFURBISH",
  "RESTOCK",
  "DECOMMISSION",
  "PENALTY",
] as const;

const selectClassName =
  "flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";

export const ReturnForm = forwardRef<ReturnFormRef, ReturnFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const { selectedReturn, serializedAssets, stockLevels, assets } =
      useWarehouseStore();
    const { mutate: createReturn, isPending } = useCreateReturn({
      mutationConfig: { onSuccess: () => onSuccess() },
    });

    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannedDevice, setScannedDevice] = useState<{
      name: string;
      assetId: number;
    } | null>(null);

    const isReadOnly = mode === "details" || mode === "edit";

    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<ReturnFormValues>({
      resolver: zodResolver(returnSchema),
      defaultValues: {
        wo_id: "",
        asset_id: 0,
        condition: "GOOD",
        disposition: "REFURBISH",
        received_warehouse_id: 1,
        actor: user?.id ?? "",
      },
    });

    useEffect(() => {
      if (user?.id) {
        setValue("actor", user.id);
      }
    }, [user?.id, setValue]);

    useEffect(() => {
      if (isReadOnly && selectedReturn) {
        reset({
          wo_id: selectedReturn.woId || selectedReturn.woNumber,
          asset_id: Number(selectedReturn.assetId) || 0,
          condition: (selectedReturn.condition ?? "good").toUpperCase(),
          disposition: selectedReturn.notes ?? "REFURBISH",
          received_warehouse_id: Number(selectedReturn.warehouseId) || 1,
          actor: selectedReturn.receivedBy ?? "",
        });
      }
    }, [isReadOnly, selectedReturn, reset]);

    const handleDeviceScan = (result: ScanResult) => {
      const match = matchScannedQR(
        result.text,
        serializedAssets,
        stockLevels,
        assets
      );
      if (match.type === "asset" && match.data) {
        const asset = match.data as WarehouseAsset;
        const assetId = Number(asset.id);
        if (assetId > 0) {
          setValue("asset_id", assetId);
        }
        setScannedDevice({
          name: asset.name,
          assetId: assetId > 0 ? assetId : 0,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending,
    }));

    function onSubmit(values: ReturnFormValues) {
      if (mode !== "new") return;
      createReturn(
        buildCreateReturnPayload({
          ...values,
          actor: values.actor || user?.id || "",
        })
      );
    }

    return (
      <div className="space-y-5 px-1 py-2 pb-6">
        <input type="hidden" {...register("actor")} />

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.woNumber", "WO ID")} *
          </label>
          <Input
            {...register("wo_id")}
            readOnly={isReadOnly}
            placeholder="WO-SIT-RETURN-001"
            className="text-xs h-10 font-mono"
          />
          {errors.wo_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.wo_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.assetId", "Asset ID")} *
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
          <Input
            type="number"
            min={1}
            {...register("asset_id", { valueAsNumber: true })}
            readOnly={isReadOnly}
            className="text-xs h-10 font-mono"
          />
          {errors.asset_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.asset_id.message}
            </p>
          )}
          {scannedDevice && (
            <ScanResultBadge
              success
              label="Device"
              value={`${scannedDevice.name}${scannedDevice.assetId ? ` (#${scannedDevice.assetId})` : ""}`}
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.condition", "Condition")} *
            </label>
            <select
              {...register("condition")}
              disabled={isReadOnly}
              className={selectClassName}
            >
              {CONDITION_OPTIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.condition.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.disposition", "Disposition")} *
            </label>
            <select
              {...register("disposition")}
              disabled={isReadOnly}
              className={selectClassName}
            >
              {DISPOSITION_OPTIONS.map((disposition) => (
                <option key={disposition} value={disposition}>
                  {disposition}
                </option>
              ))}
            </select>
            {errors.disposition && (
              <p className="text-[10px] text-destructive font-bold">
                {errors.disposition.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.warehouseLabel", "Received Warehouse")} *
          </label>
          <select
            {...register("received_warehouse_id", { valueAsNumber: true })}
            disabled={isReadOnly}
            className={selectClassName}
          >
            {WAREHOUSE_OPTIONS.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
          {errors.received_warehouse_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.received_warehouse_id.message}
            </p>
          )}
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
