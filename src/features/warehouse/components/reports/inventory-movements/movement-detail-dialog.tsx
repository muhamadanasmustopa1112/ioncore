"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";
import {
  decodeMovementMetadata,
  getMovementTypeVariant,
} from "@/features/warehouse/types/inventory-movements";

interface MovementDetailDialogProps {
  movement: InventoryMovementItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function MovementDetailDialog({
  movement,
  open,
  onOpenChange,
}: MovementDetailDialogProps) {
  const { t } = useTranslation();

  if (!movement) return null;

  const parsedMetadata = decodeMovementMetadata(movement.metadata);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold">
            {t("warehouse.movementDetail", "Movement Detail")} #{movement.id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pb-2">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.movementType", "Movement Type")}
                value={
                  <Badge
                    variant={getMovementTypeVariant(movement.movement_type)}
                    appearance="light"
                    className="text-[10px] uppercase"
                  >
                    {movement.movement_type.replace(/_/g, " ")}
                  </Badge>
                }
              />
              <DetailRow
                label={t("common.createdAt", "Created At")}
                value={new Date(movement.created_at).toLocaleString()}
              />
            </div>

            <DetailRow
              label={t("warehouse.itemDetails", "Item")}
              value={
                <div>
                  <div className="font-medium">{movement.item_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {movement.sku} · ID {movement.stock_item_id}
                  </div>
                </div>
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.warehouseLabel", "Warehouse")}
                value={
                  <div>
                    <div>{movement.warehouse_name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {movement.warehouse_code} · #{movement.warehouse_id}
                    </div>
                  </div>
                }
              />
              <DetailRow
                label={t("warehouse.quantity", "Quantity")}
                value={
                  <span className="font-bold">
                    {movement.quantity} {movement.unit}
                  </span>
                }
              />
            </div>

            {(movement.asset_id != null || movement.asset_serial_number) && (
              <DetailRow
                label={t("warehouse.asset", "Asset")}
                value={
                  <div className="font-mono text-xs">
                    {movement.asset_serial_number ?? "—"}
                    {movement.asset_id != null && (
                      <span className="text-muted-foreground">
                        {" "}
                        · #{movement.asset_id}
                      </span>
                    )}
                  </div>
                }
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.referenceType", "Reference Type")}
                value={
                  <span className="capitalize">
                    {movement.reference_type.replace(/_/g, " ")}
                  </span>
                }
              />
              <DetailRow
                label={t("warehouse.referenceId", "Reference ID")}
                value={
                  <span className="font-mono text-xs">{movement.reference_id}</span>
                }
              />
            </div>

            <DetailRow
              label={t("warehouse.actor", "Actor")}
              value={movement.actor}
            />

            {parsedMetadata && (
              <DetailRow
                label={t("warehouse.metadata", "Metadata")}
                value={
                  <pre className="text-[10px] font-mono bg-muted/50 rounded-md p-3 overflow-x-auto">
                    {JSON.stringify(parsedMetadata, null, 2)}
                  </pre>
                }
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
