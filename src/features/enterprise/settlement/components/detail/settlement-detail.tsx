"use client";

import { useTranslation } from "react-i18next";
import { ArrowLeft, Calculator, CreditCard, FileText } from "lucide-react";
import { RiDownloadLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useSettlement } from "../../api/get-settlement";
import type { PaymentStatus } from "../../types/settlement";

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<PaymentStatus, "warning" | "success" | "destructive"> = {
  pending: "warning",
  paid: "success",
  overdue: "destructive",
};

function SummaryCard({ period, reseller, status }: { period: string; reseller: string; status: PaymentStatus }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t("enterprise.settlement.detail.summary", "Summary")}</h3>
          <Badge variant={statusVariant[status]} appearance="light" className="text-xs font-semibold uppercase">
            {t(`enterprise.settlement.status.${status}`, status)}
          </Badge>
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.colPeriod", "Period")}</span>
            <span className="font-medium">{period}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.colReseller", "Reseller")}</span>
            <span className="font-medium">{reseller}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CalculationBreakdownCard({
  subscriber_count,
  collected_revenue,
  wholesale_fee,
  revenue_share_pct,
  revenue_share_amount,
  total_due,
}: {
  subscriber_count: number;
  collected_revenue: number;
  wholesale_fee: number;
  revenue_share_pct: number;
  revenue_share_amount: number;
  total_due: number;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardHeading className="flex items-center gap-2">
          <Calculator className="size-4 text-muted-foreground" />
          <span className="font-semibold">{t("enterprise.settlement.detail.calculation", "Calculation Breakdown")}</span>
        </CardHeading>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.subscriberCount", "Subscriber Count")}</span>
            <span className="font-medium">{subscriber_count.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.collectedRevenue", "Collected Revenue")}</span>
            <span className="font-medium">{idr(collected_revenue)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.wholesaleFee", "Wholesale Fee (Fixed)")}</span>
            <span className="font-medium">{idr(wholesale_fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.revSharePct", "Revenue Share %")}</span>
            <span className="font-medium">{(revenue_share_pct * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.revShareAmount", "Revenue Share Amount")}</span>
            <span className="font-medium">{idr(revenue_share_amount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base">
            <span className="font-semibold">{t("enterprise.settlement.detail.totalDue", "Total Due to ION")}</span>
            <span className="font-bold text-primary">{idr(total_due)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentInfoCard({
  submitted_at,
  confirmed_at,
  notes,
}: {
  submitted_at: string | null;
  confirmed_at: string | null;
  notes: string;
}) {
  const { t } = useTranslation();
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "-";

  return (
    <Card>
      <CardHeader>
        <CardHeading className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <span className="font-semibold">{t("enterprise.settlement.detail.paymentInfo", "Payment Info")}</span>
        </CardHeading>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.submittedAt", "Submitted")}</span>
            <span className="font-medium">{formatDate(submitted_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("enterprise.settlement.detail.confirmedAt", "Confirmed")}</span>
            <span className="font-medium">{formatDate(confirmed_at)}</span>
          </div>
          {notes && (
            <>
              <Separator />
              <div>
                <span className="text-muted-foreground text-sm">{t("enterprise.settlement.detail.notes", "Notes")}</span>
                <p className="mt-1 text-sm">{notes}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettlementDetailPage({ settlementId }: { settlementId: string }) {
  const { t } = useTranslation();
  const { data: settlement, isLoading } = useSettlement(settlementId);

  if (isLoading) {
    return (
      <div className="px-6 py-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="px-6 py-4 text-muted-foreground">
        {t("common.notFound", "Not found")}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
          { title: t("enterprise.settlement.title", "Settlement"), path: paths.dashboard.enterprise.settlement.root.getHref() },
          { title: `${settlement.reseller_name} - ${settlement.period_yyyy_mm}` },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="size-5" />
            </Button>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
              {settlement.reseller_name} &mdash; {settlement.period_yyyy_mm}
            </ToolbarTitle>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          {settlement.pdf_url && (
            <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
              <RiDownloadLine className="size-4" />
              {t("enterprise.settlement.detail.downloadPdf", "Download PDF")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SummaryCard
          period={settlement.period_yyyy_mm}
          reseller={settlement.reseller_name}
          status={settlement.payment_status}
        />
        <CalculationBreakdownCard
          subscriber_count={settlement.subscriber_count}
          collected_revenue={settlement.collected_revenue}
          wholesale_fee={settlement.wholesale_fee}
          revenue_share_pct={settlement.revenue_share_pct}
          revenue_share_amount={settlement.revenue_share_amount}
          total_due={settlement.total_due}
        />
        <PaymentInfoCard
          submitted_at={settlement.submitted_at}
          confirmed_at={settlement.confirmed_at}
          notes={settlement.notes}
        />
      </div>
    </div>
  );
}
