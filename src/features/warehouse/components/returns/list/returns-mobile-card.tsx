"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  User,
  FileText,
  Calendar,
  Shield,
  Wrench,
  Clock,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeviceReturnRecord } from "@/features/warehouse/types";

const statusVariantMap: Record<
  string,
  "info" | "secondary" | "destructive" | "warning" | "success"
> = {
  pending_return: "warning",
  received: "info",
  restocked: "success",
  decommissioned: "destructive",
};

const statusBorderMap: Record<string, string> = {
  pending_return: "border-l-amber-500",
  received: "border-l-blue-500",
  restocked: "border-l-emerald-500",
  decommissioned: "border-l-red-500",
};

const statusIconBgMap: Record<string, string> = {
  pending_return: "bg-amber-50 dark:bg-amber-950/40",
  received: "bg-blue-50 dark:bg-blue-950/40",
  restocked: "bg-emerald-50 dark:bg-emerald-950/40",
  decommissioned: "bg-red-50 dark:bg-red-950/40",
};

const statusIconColorMap: Record<string, string> = {
  pending_return: "text-amber-500",
  received: "text-blue-500",
  restocked: "text-emerald-500",
  decommissioned: "text-red-500",
};

const statusIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  pending_return: Clock,
  received: CheckCircle2,
  restocked: RotateCcw,
  decommissioned: Trash2,
};

const statusLabels: Record<string, string> = {
  pending_return: "Pending",
  received: "Received",
  restocked: "Restocked",
  decommissioned: "Decommissioned",
};

const ownershipLabels: Record<string, string> = {
  ion_owned: "ION Owned",
  leased: "Leased",
  customer_owned: "Customer Owned",
};

const conditionVariantMap: Record<string, "success" | "destructive"> = {
  good: "success",
  damaged: "destructive",
};

interface ReturnsMobileCardProps {
  item: DeviceReturnRecord;
  onDetail?: (item: DeviceReturnRecord) => void;
}

export function ReturnsMobileCard({ item, onDetail }: ReturnsMobileCardProps) {
  const StatusIconComponent = statusIcon[item.status] || Clock;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        statusBorderMap[item.status] || "border-l-slate-300"
      )}
      onClick={() => onDetail?.(item)}
    >
      {/* Top Section */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              statusIconBgMap[item.status] || "bg-slate-50"
            )}
          >
            <StatusIconComponent
              className={cn(
                "size-5",
                statusIconColorMap[item.status] || "text-slate-500"
              )}
            />
          </div>

          {/* Title + Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.assetName}
              </h3>
              <Badge
                variant={statusVariantMap[item.status] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {statusLabels[item.status] || item.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              SN: {item.serialNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Customer + WO */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Customer */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Customer
            </div>
            <div className="flex items-center gap-1">
              <User className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.customerName}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* WO Number */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Work Order
            </div>
            <div className="flex items-center gap-1">
              <FileText className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.woNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Ownership + Condition + Date Row */}
        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
          {/* Ownership */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Shield className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Ownership
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-bold uppercase"
            >
              {ownershipLabels[item.ownership] || item.ownership.replace("_", " ")}
            </Badge>
          </div>

          {/* Condition */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Wrench className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Condition
              </span>
            </div>
            {item.condition ? (
              <Badge
                variant={conditionVariantMap[item.condition] || "secondary"}
                appearance="light"
                className="text-[9px] font-bold uppercase"
              >
                {item.condition}
              </Badge>
            ) : (
              <span className="text-[10px] text-muted-foreground">—</span>
            )}
          </div>

          {/* Date */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1 mb-0.5">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Initiated
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground">
              {formatDate(item.dateInitiated)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-slate-50 dark:border-slate-800/50">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 rounded-none text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
          onClick={(e) => {
            e.stopPropagation();
            onDetail?.(item);
          }}
        >
          <Eye className="size-3.5 mr-1.5" />
          View Details
        </Button>
      </div>
    </div>
  );
}
