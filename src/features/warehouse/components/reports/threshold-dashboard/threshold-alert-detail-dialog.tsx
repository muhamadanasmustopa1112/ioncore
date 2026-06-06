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
import type { ThresholdDashboardItem } from "@/features/warehouse/types/threshold-dashboard";
import {
  getSuggestedActionVariant,
  getThresholdStatusVariant,
} from "@/features/warehouse/types/threshold-dashboard";

interface ThresholdAlertDetailDialogProps {
  alert: ThresholdDashboardItem | null;
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

export function ThresholdAlertDetailDialog({
  alert,
  open,
  onOpenChange,
}: ThresholdAlertDetailDialogProps) {
  const { t } = useTranslation();

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold">
            {t("warehouse.thresholdAlertDetail", "Threshold Alert")} #
            {alert.threshold_alert_id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={getThresholdStatusVariant(alert.status)}
                appearance="light"
                className="text-[10px] uppercase"
              >
                {alert.status}
              </Badge>
              <Badge
                variant={getSuggestedActionVariant(alert.suggested_action)}
                appearance="light"
                className="text-[10px] uppercase"
              >
                {alert.suggested_action.replace(/_/g, " ")}
              </Badge>
              <Badge variant="secondary" appearance="light" className="text-[10px]">
                {alert.warehouse_type}
              </Badge>
            </div>

            <DetailRow
              label={t("warehouse.itemDetails", "Item")}
              value={
                <div>
                  <div className="font-medium">{alert.item_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {alert.sku} · ID {alert.stock_item_id}
                  </div>
                </div>
              }
            />

            <DetailRow
              label={t("warehouse.warehouseLabel", "Warehouse")}
              value={
                <div>
                  <div>{alert.warehouse_name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {alert.warehouse_code} · #{alert.warehouse_id}
                  </div>
                </div>
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <DetailRow
                label={t("warehouse.currentQty", "Current Qty")}
                value={
                  <span className="font-bold tabular-nums text-red-600 dark:text-red-400">
                    {alert.current_qty}
                  </span>
                }
              />
              <DetailRow
                label={t("warehouse.thresholdQty", "Threshold")}
                value={
                  <span className="font-bold tabular-nums">{alert.threshold_qty}</span>
                }
              />
              <DetailRow
                label={t("warehouse.cascadeLevel", "Cascade Level")}
                value={alert.cascade_level}
              />
            </div>

            {alert.estimated_days_to_stockout != null && (
              <DetailRow
                label={t("warehouse.daysToStockout", "Est. Days to Stockout")}
                value={alert.estimated_days_to_stockout}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.recipientCount", "Recipients")}
                value={alert.recipient_count}
              />
              <DetailRow
                label={t("warehouse.actionCount", "Actions")}
                value={alert.action_count}
              />
            </div>

            {(alert.auto_transfer_request_id != null ||
              alert.escalation_warehouse_id != null) && (
              <div className="grid grid-cols-2 gap-4">
                {alert.auto_transfer_request_id != null && (
                  <DetailRow
                    label={t("warehouse.autoTransferRequest", "Auto Transfer")}
                    value={`#${alert.auto_transfer_request_id}`}
                  />
                )}
                {alert.escalation_warehouse_id != null && (
                  <DetailRow
                    label={t("warehouse.escalationWarehouse", "Escalation WH")}
                    value={`#${alert.escalation_warehouse_id}`}
                  />
                )}
              </div>
            )}

            {alert.last_action_type && (
              <DetailRow
                label={t("warehouse.lastAction", "Last Action")}
                value={
                  <span>
                    {alert.last_action_type}
                    {alert.last_action_by && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {alert.last_action_by}
                      </span>
                    )}
                  </span>
                }
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.lastCrossedAt", "Last Crossed")}
                value={new Date(alert.last_crossed_at).toLocaleString()}
              />
              <DetailRow
                label={t("warehouse.escalatedAt", "Escalated At")}
                value={new Date(alert.escalated_at).toLocaleString()}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={t("warehouse.ackDeadline", "Ack Deadline")}
                value={new Date(alert.ack_deadline_at).toLocaleString()}
              />
              {alert.acknowledged_at && (
                <DetailRow
                  label={t("warehouse.acknowledgedAt", "Acknowledged At")}
                  value={new Date(alert.acknowledged_at).toLocaleString()}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
