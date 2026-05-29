"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  DollarSign,
  Wifi,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBulkOperationWizardStore } from "../../store/wizard";
import { dummyPlans } from "../../data/dummy";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

const scopeLabels = {
  all: "All Customers",
  by_area: "By Area",
  by_type: "By Customer Type",
  manual: "Manual Selection",
};

const sampleCustomers = [
  { id: "cust-001", name: "PT Maju Jaya", area: "Jakarta Selatan", type: "business", currentPlan: "Business 100Mbps" },
  { id: "cust-002", name: "CV Berkah", area: "Jakarta Selatan", type: "business", currentPlan: "Business 100Mbps" },
  { id: "cust-003", name: "UD Sentosa", area: "Bandung Timur", type: "broadband", currentPlan: "Basic 10Mbps" },
  { id: "cust-004", name: "PT Abadi Makmur", area: "Jakarta Utara", type: "enterprise", currentPlan: "Enterprise 200Mbps" },
  { id: "cust-005", name: "CV Sejahtera", area: "Surabaya Utara", type: "broadband", currentPlan: "Standard 20Mbps" },
];

export function Step3ReviewPreview() {
  const { t } = useTranslation();
  const { sourcePlan, targetPlan, scopeType, selectedAreas } =
    useBulkOperationWizardStore();
  const [expanded, setExpanded] = useState(false);

  const affectedCount = useMemo(() => {
    switch (scopeType) {
      case "all":
        return 1850;
      case "by_area":
        return selectedAreas.length * 150;
      case "by_type":
        return 450;
      case "manual":
        return 5;
      default:
        return 0;
    }
  }, [scopeType, selectedAreas]);

  const billingDelta = useMemo(() => {
    if (sourcePlan && targetPlan) {
      return (targetPlan.monthlyPrice - sourcePlan.monthlyPrice) * affectedCount;
    }
    return 0;
  }, [sourcePlan, targetPlan, affectedCount]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {t("bulkOperations.step3.title", "Review & Preview")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "bulkOperations.step3.description",
            "Review the operation summary before execution."
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <Users className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("bulkOperations.affectedCustomers", "Affected Customers")}
            </p>
            <p className="text-xl font-bold">{affectedCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
            <DollarSign className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("bulkOperations.billingDelta", "Billing Delta (MRC)")}
            </p>
            <p
              className={`text-xl font-bold ${
                billingDelta > 0
                  ? "text-green-600 dark:text-green-400"
                  : billingDelta < 0
                    ? "text-red-600 dark:text-red-400"
                    : ""
              }`}
            >
              {billingDelta > 0 ? "+" : ""}
              {formatPrice(billingDelta)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
            <Wifi className="size-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("bulkOperations.ionRadiusChanges", "ION Radius Changes")}
            </p>
            <p className="text-xl font-bold">
              {affectedCount}{" "}
              {t("bulkOperations.profileUpdates", "profile updates")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
            <Shield className="size-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("bulkOperations.approvalRequired", "Approval Required")}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="outline">Finance</Badge>
              <Badge variant="outline">Management</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h4 className="font-medium">
              {t("bulkOperations.operationSummary", "Operation Summary")}
            </h4>
          </div>
        </div>
        <div className="space-y-2 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("bulkOperations.sourcePlan", "Source Plan")}
            </span>
            <span className="font-medium">{sourcePlan?.name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("bulkOperations.targetPlan", "Target Plan")}
            </span>
            <span className="font-medium">{targetPlan?.name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("bulkOperations.scope", "Scope")}
            </span>
            <span className="font-medium">{scopeLabels[scopeType]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("bulkOperations.priceChangePerCustomer", "Price Change/Customer")}
            </span>
            <span className="font-medium">
              {sourcePlan && targetPlan
                ? formatPrice(targetPlan.monthlyPrice - sourcePlan.monthlyPrice)
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <h4 className="font-medium">
            {t("bulkOperations.customerList", "Customer List")} ({sampleCustomers.length})
          </h4>
          {expanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>
        {expanded && (
          <div className="border-t">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Area</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Current Plan</th>
                </tr>
              </thead>
              <tbody>
                {sampleCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium">{customer.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{customer.area}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{customer.type}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{customer.currentPlan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
        <AlertTriangle className="mt-0.5 size-4 text-yellow-600 dark:text-yellow-400" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800 dark:text-yellow-300">
            {t("bulkOperations.warningTitle", "Important Notice")}
          </p>
          <p className="mt-1 text-yellow-700 dark:text-yellow-400">
            {t(
              "bulkOperations.warningMessage",
              "This operation will modify billing for affected customers. Please ensure all details are correct before proceeding. Changes to ION Radius profiles are irreversible."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
