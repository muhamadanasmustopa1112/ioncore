"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockTransfer } from "@/features/warehouse/types";

const statusVariantMap: Record<
  string,
  "info" | "secondary" | "destructive" | "warning" | "success"
> = {
  pending: "warning",
  in_transit: "info",
  received: "success",
  cancelled: "destructive",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface DetailFieldProps {
  label: string;
  value: ReactNode;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

interface TransferDetailViewProps {
  transfer: StockTransfer;
  showNotes?: boolean;
}

export function TransferDetailView({
  transfer,
  showNotes = true,
}: TransferDetailViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 px-1 py-2 pb-6">
      <DetailField
        label={t("warehouse.transferId", "Transfer ID")}
        value={<span className="font-mono text-xs">{transfer.id}</span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.sourceWarehouse", "Source Warehouse")}
          value={transfer.sourceWarehouseName}
        />
        <DetailField
          label={t("warehouse.destinationWarehouse", "Destination Warehouse")}
          value={transfer.destinationWarehouseName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("common.status", "Status")}
          value={
            <Badge
              variant={statusVariantMap[transfer.status] || "secondary"}
              appearance="light"
              className="text-[10px] uppercase"
            >
              {transfer.status.replace(/_/g, " ")}
            </Badge>
          }
        />
        <DetailField
          label={t("warehouse.initiatedBy", "Initiated By")}
          value={transfer.initiatedByName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.dateInitiated", "Date Initiated")}
          value={formatDate(transfer.dateInitiated)}
        />
        {transfer.dateDispatched && (
          <DetailField
            label={t("warehouse.dateDispatched", "Date Dispatched")}
            value={formatDate(transfer.dateDispatched)}
          />
        )}
        {transfer.dateReceived && (
          <DetailField
            label={t("warehouse.dateReceived", "Date Received")}
            value={formatDate(transfer.dateReceived)}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.transferItems", "Transfer Items")}
          </span>
        </div>
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.itemName", "Item")}
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase">
                  SKU
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.itemType", "Type")}
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.quantity", "Qty")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfer.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs">{item.stockItemName}</TableCell>
                  <TableCell className="text-[10px] font-mono">
                    {item.stockItemSku}
                  </TableCell>
                  <TableCell className="text-xs capitalize">
                    {item.itemType}
                  </TableCell>
                  <TableCell className="text-xs font-bold">
                    {item.qty} {item.uom}
                  </TableCell>
                </TableRow>
              ))}
              {transfer.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-xs text-muted-foreground py-6"
                  >
                    {t("warehouse.noTransferItems", "No items.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {showNotes && transfer.notes && (
        <DetailField
          label={t("warehouse.notes", "Notes")}
          value={
            <p className="text-sm whitespace-pre-wrap">{transfer.notes}</p>
          }
        />
      )}
    </div>
  );
}
