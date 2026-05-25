"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomer, useUpdateCustomerStatus } from "@/features/customers/api/customers-queries";
import { CustomerHeader } from "./customer-header";
import { ServiceOverview } from "./service-overview";
import { PaymentHistoryTable } from "./payment-history-table";
import { CustomerWidgets } from "./customer-widgets";
import { AddServiceSheet } from "./add-service-sheet";
import { CustomerSchemasSection } from "./customer-schemas-section";

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-2 py-2.5 border-b border-border/40 last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium break-all">{value ?? "—"}</span>
    </div>
  );
}

function fmt(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleString();
}

export function CustomerProfile() {
  const { t } = useTranslation();
  const params = useParams<{ customerId: string }>();
  const id = params?.customerId ?? "";
  const { data: customer, isLoading } = useCustomer(id);
  const updateStatus = useUpdateCustomerStatus(id);
  const [addServiceOpen, setAddServiceOpen] = useState(false);

  const attrEntries = customer?.customer_attribute
    ? Object.entries(customer.customer_attribute)
    : [];

  function handleDeactivate() {
    if (!window.confirm(t("customers.deactivateConfirm", "Deactivate this customer's service? This will set their status to suspended."))) return;
    updateStatus.mutate("suspended");
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm-and-sales">{t("menu.crmAndSales")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {customer?.full_name ?? (isLoading ? t("common.loading") : t("customers.title"))}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CustomerHeader
        customer={customer ?? undefined}
        onAddService={() => setAddServiceOpen(true)}

        onDeactivate={handleDeactivate}
        isDeactivating={updateStatus.isPending}
      />

      <AddServiceSheet
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        customerId={id}
        customerLat={customer?.lat}
        customerLon={customer?.lon}
        customerAddress={customer?.location?.address}
        leadId={customer?.lead_id}
        branchId={customer?.branch_id}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Main column ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Profile Details */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-sm">{t("customers.profileDetails", "Profile Details")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4 px-6">
              <DetailRow label={t("customers.nik")} value={customer?.nik} />
              <DetailRow label={t("customers.fullName")} value={customer?.full_name} />
              <DetailRow label={t("common.phone")} value={customer?.phone} />
              <DetailRow label={t("common.email")} value={customer?.email} />
              <DetailRow label={t("customers.companyName")} value={customer?.company_name} />
              <DetailRow label={t("customers.customerType")} value={customer?.customer_type} />
              <DetailRow label={t("common.status")} value={customer?.status} />
              <DetailRow label={t("customers.accountManagerId")} value={customer?.account_manager_id} />
            </CardContent>
          </Card>

          {/* Schema Versions */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-sm">{t("customers.schemaVersions")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4 px-6">
              <DetailRow label={t("customers.onboardingSchema")} value={customer?.onboarding_schema_version_id} />
              <DetailRow label={t("customers.billingSchema")} value={customer?.billing_schema_version_id} />
              <DetailRow label={t("customers.serviceSchema")} value={customer?.service_schema_version_id} />
              <DetailRow label={t("customers.commissionSchema")} value={customer?.commission_schema_version_id} />
              <DetailRow label={t("customers.suspensionSchema")} value={customer?.suspension_schema_version_id} />
            </CardContent>
          </Card>

          <CustomerSchemasSection customerId={id} />

          {/* Timestamps */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-sm">{t("customers.timestamps", "Timestamps")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4 px-6">
              <DetailRow label={t("common.activationDate", "Activation Date")} value={fmt(customer?.activation_date)} />
              <DetailRow label={t("common.createdAt")} value={fmt(customer?.created_at)} />
              <DetailRow label={t("common.updatedAt")} value={fmt(customer?.updated_at)} />
              <DetailRow label={t("common.createdBy", "Created By")} value={customer?.created_by} />
              <DetailRow label={t("common.updatedBy", "Updated By")} value={customer?.updated_by} />
            </CardContent>
          </Card>

          {/* Customer Attribute */}
          {attrEntries.length > 0 && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-sm">{t("customers.customAttributes", "Custom Attributes")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-4 px-6">
                {attrEntries.map(([key, val]) => (
                  <DetailRow
                    key={key}
                    label={key}
                    value={typeof val === "object" ? JSON.stringify(val) : String(val ?? "—")}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          <ServiceOverview customerId={id} />
          <PaymentHistoryTable />
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-6">
          {/* Location */}
          {(customer?.lat || customer?.location) && (
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-sm">{t("customers.location", "Location")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-sm space-y-1">
                {customer.location?.address && <p>{customer.location.address}</p>}
                {customer.lat && customer.lon && (
                  <p className="text-xs text-muted-foreground">
                    {customer.lat.toFixed(6)}, {customer.lon.toFixed(6)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm">{t("customers.documents", "Documents")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {(customer?.documents ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("customers.noDocuments", "No documents")}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {(customer?.documents ?? []).map((doc) => (
                    <div key={doc.id} className="text-sm border rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="capitalize font-medium">
                          {doc.document_type.replace(/_/g, " ")}
                        </span>
                        <Badge
                          variant={
                            doc.status === "approved"
                              ? "success"
                              : doc.status === "rejected"
                                ? "destructive"
                                : "warning"
                          }
                          appearance="light"
                          size="sm"
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      {doc.note && (
                        <p className="text-xs text-muted-foreground italic">{doc.note}</p>
                      )}
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline block truncate"
                      >
                        {t("customers.viewFile", "View file")}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Orders */}
          {(customer?.work_orders ?? []).length > 0 && (
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-sm">{t("menu.workOrders")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex flex-col divide-y text-sm">
                  {(customer?.work_orders ?? []).map((wo) => (
                    <div
                      key={wo.id}
                      className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="font-mono text-xs text-muted-foreground truncate">
                        {String(wo.id).slice(0, 8)}…
                      </span>
                      <Badge variant="secondary" appearance="light" size="sm">
                        {String(wo.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <CustomerWidgets customer={customer ?? undefined} />
        </div>
      </div>
    </div>
  );
}
