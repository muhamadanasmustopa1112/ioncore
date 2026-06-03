"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { RiArrowLeftLine, RiEditLine, RiPrinterLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useInvoice } from "../../api/get-invoice";
import { useInvoiceStore } from "../../store/invoice";
import { useCustomer } from "@/features/customers/api/customers-queries";
import { useSchemaVersion } from "@/features/administration/schema/api/schema-queries";
import type { AppliedBillingSchemaRules } from "../../types";

const statusVariant: Record<string, "primary" | "secondary" | "destructive" | "outline" | "success"> = {
  draft: "outline",
  sent: "secondary",
  paid: "success",
  overdue: "destructive",
  partial: "secondary",
  cancelled: "destructive",
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function InvoiceDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { openInvoiceFormSheet, setSelectedInvoice } = useInvoiceStore();

  const id = typeof window !== "undefined"
    ? window.location.pathname.split("/").pop() || ""
    : "";

  const { data, isLoading } = useInvoice({ id });
  const invoice = data?.data;

  const { data: customer } = useCustomer(invoice?.customerId ?? "");

  const { data: schemaVersion } = useSchemaVersion(
    invoice?.billingSchemaVersionId ?? null
  );

  const schemaName = invoice?.billingSchemaName || schemaVersion?.id || "—";
  const schemaVersionLabel = invoice?.billingSchemaVersion || schemaVersion?.version || "—";
  const schemaRules = (schemaVersion?.content as AppliedBillingSchemaRules | null) ?? invoice?.appliedSchemaRules;

  const customerType = customer?.customer_type ?? invoice?.customerType ?? "broadband";
  const customerBranch = customer?.branch_name ?? invoice?.branch;

  if (isLoading || !invoice) {
    return (
      <div className="relative h-full w-full overflow-hidden px-6 py-3">
        <PageBreadcrumb items={[
          { title: t("menu.finance"), path: paths.dashboard.finance.root.getHref() },
          { title: t("menu.invoices"), path: paths.dashboard.finance.invoice.root.getHref() },
          { title: t("billing.invoice.detail") },
        ]} />
        <div className="mt-6 text-center text-muted-foreground">
          {isLoading ? t("common.loading") : t("billing.invoice.notFound", "Invoice not found")}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[
        { title: t("menu.finance"), path: paths.dashboard.finance.root.getHref() },
        { title: t("menu.invoices"), path: paths.dashboard.finance.invoice.root.getHref() },
        { title: invoice.invoiceNumber },
      ]} />

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <RiArrowLeftLine className="size-4 mr-1" />
            {t("common.back")}
          </Button>
          <h1 className="text-xl font-bold">{invoice.invoiceNumber}</h1>
          <Badge variant={statusVariant[invoice.status]} className="capitalize">
            {t(`billing.common.${invoice.status}`)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RiPrinterLine className="size-4 mr-1" />
            {t("billing.invoice.print")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedInvoice(invoice);
              openInvoiceFormSheet("edit");
            }}
          >
            <RiEditLine className="size-4 mr-1" />
            {t("billing.common.edit")}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("billing.invoice.billingInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.customer")}</span>
                  <p className="font-medium">{customer?.full_name ?? invoice.customerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Customer ID</span>
                  <p className="font-medium">{invoice.customerId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.customerType")}</span>
                  <p className="font-medium capitalize">{customerType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.type")}</span>
                  <p className="font-medium capitalize">{t(`billing.common.${invoice.type}`)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.issuedDate")}</span>
                  <p className="font-medium">{invoice.issuedDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.dueDate")}</span>
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <span className="text-muted-foreground">{t("billing.invoice.paidDate")}</span>
                    <p className="font-medium">{invoice.paidDate}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">{t("billing.invoice.branch")}</span>
                  <p className="font-medium">{customerBranch ?? invoice.branch}</p>
                </div>
                {customer?.status && (
                  <div>
                    <span className="text-muted-foreground">{t("billing.invoice.customerStatus", "Customer Status")}</span>
                    <p>
                      <Badge variant={customer.status === "active" ? "success" : customer.status === "suspended" ? "destructive" : "outline"} className="capitalize">
                        {customer.status}
                      </Badge>
                    </p>
                  </div>
                )}
                {customer?.email && (
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                )}
                {customer?.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("billing.invoice.lineItems")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">{t("billing.invoice.description")}</th>
                      <th className="text-right py-2 font-medium">{t("billing.invoice.quantity")}</th>
                      <th className="text-right py-2 font-medium">{t("billing.invoice.unitPrice")}</th>
                      <th className="text-right py-2 font-medium">{t("billing.invoice.subtotal")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatIDR(item.unitPrice)}</td>
                        <td className="text-right py-2">{formatIDR(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Separator className="my-3" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("billing.invoice.subtotal")}</span>
                  <span>{formatIDR(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPN (11%)</span>
                  <span>{formatIDR(invoice.tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>{t("billing.invoice.total")}</span>
                  <span>{formatIDR(invoice.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("billing.invoice.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {schemaName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("billing.schema.appliedRules", "Applied Schema Rules")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t("billing.schema.schema", "Schema")}</span>
                    <p className="font-medium">{schemaName}</p>
                    <p className="text-xs text-muted-foreground">{schemaVersionLabel}</p>
                  </div>
                  {schemaRules && (
                    <AppliedSchemaRules rules={schemaRules} />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {invoice.fakturPajakNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Faktur Pajak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-muted-foreground">Nomor</span>
                  <p className="font-mono text-xs mt-1">{invoice.fakturPajakNumber}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("billing.invoice.metadata", "Metadata")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Created</span>
                  <p className="font-medium">{invoice.createdAt}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated</span>
                  <p className="font-medium">{invoice.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AppliedSchemaRules({ rules }: { rules: AppliedBillingSchemaRules }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 pt-2 border-t">
      <div className="flex justify-between">
        <span className="text-muted-foreground">OTC Type</span>
        <Badge variant="outline" className="capitalize text-xs">{rules.otcType || "—"}</Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("billing.schema.gracePeriod", "Grace Period")}</span>
        <Badge variant="outline" className="text-xs">{rules.gracePeriodDays ? `${rules.gracePeriodDays} days` : "—"}</Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("billing.schema.lateFee", "Late Fee")}</span>
        <Badge variant="outline" className="text-xs">
          {rules.lateFee
            ? rules.lateFee.type === "percentage"
              ? `${rules.lateFee.value}%`
              : `Rp ${rules.lateFee.value.toLocaleString("id-ID")}`
            : "None"}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t("billing.schema.taxRate", "Tax Rate")}</span>
        <Badge variant="outline" className="text-xs">{rules.taxRate ? `${rules.taxRate}%` : "—"}</Badge>
      </div>
    </div>
  );
}
