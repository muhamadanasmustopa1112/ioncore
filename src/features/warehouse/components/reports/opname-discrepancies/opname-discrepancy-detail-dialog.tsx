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
import type { OpnameDiscrepancyItem } from "@/features/warehouse/types/opname-discrepancies";
import {
  getSessionStatusVariant,
  getVarianceQtyClass,
} from "@/features/warehouse/types/opname-discrepancies";

interface OpnameDiscrepancyDetailDialogProps {
  item: OpnameDiscrepancyItem | null;
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

export function OpnameDiscrepancyDetailDialog({
  item,
  open,
  onOpenChange,
}: OpnameDiscrepancyDetailDialogProps) {
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold">
            {t("warehouse.discrepancyDetail", "Discrepancy Detail")} #
            {item.variance_id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={getSessionStatusVariant(item.session_status)}
                appearance="light"
                className="text-[10px] uppercase"
              >
                {item.session_status.replace(/_/g, " ")}
              </Badge>
              {item.resolution && (
                <Badge variant="secondary" appearance="light" className="text-[10px]">
                  {item.resolution.replace(/_/g, " ")}
                </Badge>
              )}
            </div>

            <DetailRow
              label={t("warehouse.opnameSession", "Opname Session")}
              value={
                <div>
                  <div className="font-mono font-semibold">{item.session_number}</div>
                  <div className="text-[10px] text-muted-foreground">
                    ID {item.opname_session_id}
                  </div>
                </div>
              }
            />

            <DetailRow
              label={t("warehouse.itemDetails", "Item")}
              value={
                <div>
                  <div className="font-medium">{item.item_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {item.sku} · ID {item.stock_item_id}
                  </div>
                </div>
              }
            />

            <DetailRow
              label={t("warehouse.warehouseLabel", "Warehouse")}
              value={
                <div>
                  <div>{item.warehouse_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {item.warehouse_code} · #{item.warehouse_id}
                  </div>
                </div>
              }
            />

            <DetailRow
              label={t("warehouse.varianceQty", "Variance Qty")}
              value={
                <span
                  className={`font-bold text-lg tabular-nums ${getVarianceQtyClass(item.variance_qty)}`}
                >
                  {item.variance_qty > 0 ? "+" : ""}
                  {item.variance_qty}
                </span>
              }
            />

            {item.resolved_by && (
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  label={t("warehouse.resolvedBy", "Resolved By")}
                  value={item.resolved_by}
                />
                {item.resolved_at && (
                  <DetailRow
                    label={t("warehouse.resolvedAt", "Resolved At")}
                    value={new Date(item.resolved_at).toLocaleString()}
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("common.createdAt", "Created At")}
                value={new Date(item.created_at).toLocaleString()}
              />
              <DetailRow
                label={t("common.updatedAt", "Updated At")}
                value={new Date(item.updated_at).toLocaleString()}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
