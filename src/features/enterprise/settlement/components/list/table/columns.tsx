"use client";

import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import type { Settlement, PaymentStatus } from "../../../types/settlement";
import { useSettlementStore } from "../../../store/settlement";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<PaymentStatus, "warning" | "success" | "destructive"> = {
  pending: "warning",
  paid: "success",
  overdue: "destructive",
};

export function useSettlementColumns(): ColumnDef<Settlement>[] {
  const { t } = useTranslation();
  const { setSelectedItem } = useSettlementStore();
  const router = useRouter();

  return [
    {
      id: "period_yyyy_mm",
      accessorFn: (row) => row.period_yyyy_mm,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colPeriod", "Period")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.period_yyyy_mm}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "reseller_name",
      accessorFn: (row) => row.reseller_name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colReseller", "Reseller")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.reseller_name}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-36" /> },
      enableSorting: true,
      size: 180,
    },
    {
      id: "subscriber_count",
      accessorFn: (row) => row.subscriber_count,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colSubscribers", "Subscribers")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.subscriber_count.toLocaleString("id-ID")}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      enableSorting: true,
      size: 110,
    },
    {
      id: "collected_revenue",
      accessorFn: (row) => row.collected_revenue,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colCollected", "Collected")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{idr(row.original.collected_revenue)}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "wholesale_fee",
      accessorFn: (row) => row.wholesale_fee,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colWholesale", "Wholesale Fee")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{idr(row.original.wholesale_fee)}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "revenue_share_amount",
      accessorFn: (row) => row.revenue_share_amount,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colShareAmount", "Rev Share")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{idr(row.original.revenue_share_amount)}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-24" /> },
      enableSorting: true,
      size: 140,
    },
    {
      id: "total_due",
      accessorFn: (row) => row.total_due,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("enterprise.settlement.colTotalDue", "Total Due")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">{idr(row.original.total_due)}</span>
      ),
      meta: { skeleton: <Skeleton className="h-4 w-28" /> },
      enableSorting: true,
      size: 150,
    },
    {
      id: "payment_status",
      accessorFn: (row) => row.payment_status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status", "Status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.payment_status]}
          appearance="light"
          className="text-[10px] font-semibold uppercase"
        >
          {t(`enterprise.settlement.status.${row.original.payment_status}`, row.original.payment_status)}
        </Badge>
      ),
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.actions", "Actions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => (
        <Button
          className="size-7"
          mode="icon"
          variant="ghost"
          onClick={() => {
            setSelectedItem(row.original);
            router.push(paths.dashboard.enterprise.settlement.detail.getHref(row.original.id));
          }}
        >
          <Eye className="size-4" />
        </Button>
      ),
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ];
}
