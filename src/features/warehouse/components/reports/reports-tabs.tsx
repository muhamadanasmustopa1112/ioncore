"use client";

import { useTranslation } from "react-i18next";
import { parseAsString, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryMovementsList } from "./inventory-movements/inventory-movements-list";
import { DispatchReportsList } from "./dispatches/dispatch-reports-list";
import { ThresholdDashboardList } from "./threshold-dashboard/threshold-dashboard-list";
import { OpnameDiscrepanciesList } from "./opname-discrepancies/opname-discrepancies-list";

export const REPORT_TABS = {
  inventoryMovements: "inventory-movements",
  dispatches: "dispatches",
  thresholdDashboard: "threshold-dashboard",
  opnameDiscrepancies: "opname-discrepancies",
} as const;

export type ReportTab = (typeof REPORT_TABS)[keyof typeof REPORT_TABS];

const TAB_VALUES = Object.values(REPORT_TABS);

function resolveActiveTab(tab: string | null): ReportTab {
  if (tab && TAB_VALUES.includes(tab as ReportTab)) {
    return tab as ReportTab;
  }
  return REPORT_TABS.inventoryMovements;
}

export function ReportsTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault(REPORT_TABS.inventoryMovements)
  );

  const activeTab = resolveActiveTab(tab);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setTab(value)}
      className="w-full"
    >
      <TabsList variant="line" className="mb-4">
        <TabsTrigger value={REPORT_TABS.inventoryMovements}>
          {t("warehouse.inventoryMovements", "Inventory Movements")}
        </TabsTrigger>
        <TabsTrigger value={REPORT_TABS.dispatches}>
          {t("warehouse.dispatchReports", "Dispatches")}
        </TabsTrigger>
        <TabsTrigger value={REPORT_TABS.thresholdDashboard}>
          {t("warehouse.thresholdDashboard", "Threshold Dashboard")}
        </TabsTrigger>
        <TabsTrigger value={REPORT_TABS.opnameDiscrepancies}>
          {t("warehouse.opnameDiscrepancies", "Opname Discrepancies")}
        </TabsTrigger>
      </TabsList>

      {activeTab === REPORT_TABS.inventoryMovements && (
        <InventoryMovementsList />
      )}
      {activeTab === REPORT_TABS.dispatches && <DispatchReportsList />}
      {activeTab === REPORT_TABS.thresholdDashboard && (
        <ThresholdDashboardList />
      )}
      {activeTab === REPORT_TABS.opnameDiscrepancies && (
        <OpnameDiscrepanciesList />
      )}
    </Tabs>
  );
}
