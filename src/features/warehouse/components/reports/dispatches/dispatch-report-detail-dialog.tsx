"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DispatchReportItem } from "@/features/warehouse/types/dispatch-reports";
import { getWarehouseLabel } from "@/features/warehouse/types/dispatch-reports";

interface DispatchReportDetailDialogProps {
  report: DispatchReportItem | null;
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

export function DispatchReportDetailDialog({
  report,
  open,
  onOpenChange,
}: DispatchReportDetailDialogProps) {
  const { t } = useTranslation();

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold">
            {t("warehouse.dispatchReportDetail", "Dispatch Report")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pb-2">
            <DetailRow
              label={t("warehouse.dispatchNumber", "Dispatch Number")}
              value={
                <span className="font-mono font-semibold">
                  {report.dispatch_number}
                </span>
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.workOrder", "Work Order")}
                value={
                  <span className="font-mono text-xs">{report.wo_id}</span>
                }
              />
              <DetailRow
                label={t("common.createdAt", "Created At")}
                value={new Date(report.created_at).toLocaleString()}
              />
            </div>

            <DetailRow
              label={t("warehouse.technician", "Technician")}
              value={report.technician_user_id}
            />

            <DetailRow
              label={t("warehouse.warehouseLabel", "Warehouse")}
              value={getWarehouseLabel(report.source_warehouse_id)}
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.lineCount", "Line Count")}
                value={
                  <span className="font-bold tabular-nums">{report.line_count}</span>
                }
              />
              <DetailRow
                label={t("warehouse.totalQuantity", "Total Quantity")}
                value={
                  <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {report.total_quantity.toLocaleString()}
                  </span>
                }
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
