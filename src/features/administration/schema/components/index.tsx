"use client";

import { useEffect } from "react";
import {
  RiAddLine,
  RiArrowLeftRightLine,
  RiDownloadLine,
  RiFileTextLine,
  RiUserSettingsLine,
  RiWifiLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useSchemaStore, SchemaView } from "../store/schema";
import { useSchemaList } from "../api/schema-queries";
import { SchemaList } from "./list/schema-list";
import { SchemaFormSheet } from "./schema-form-sheet";
import { ApprovalPanel } from "./workflow/approval-panel";
import { HistoryPanel } from "./history/history-panel";
import { SchemaMigrationView } from "./history/migration-view";
import { AssignmentRulesPanel } from "./policy/assignment-rules-panel";
import { CustomerOverridePanel } from "./policy/customer-override-panel";
import { ServiceChangePolicyPanel } from "./policy/service-change-policy-panel";
import { UpgradeEligibilityPanel } from "./policy/upgrade-eligibility-panel";
import { ChangeMatrixPanel } from "./policy/change-matrix-panel";
import { BroadbandPlanSchemasPanel } from "./policy/broadband-plan-schemas-panel";

const VIEWS: { value: SchemaView; label: string; icon: React.ReactNode }[] = [
  { value: "schemas", label: "Schema Library", icon: <RiFileTextLine className="size-3.5" /> },
  { value: "customer-overrides", label: "Customer Overrides", icon: <RiUserSettingsLine className="size-3.5" /> },
  { value: "broadband-plan-schemas", label: "Broadband Plan Schemas", icon: <RiWifiLine className="size-3.5" /> },
  { value: "schema-migration", label: "Schema Migration", icon: <RiArrowLeftRightLine className="size-3.5" /> },
];

const VIEW_TITLES: Record<SchemaView, string> = {
  "schemas": "Schema Library",
  "assignment-rules": "Assignment Rules Manager",
  "customer-overrides": "Per-Customer Schema Override",
  "broadband-plan-schemas": "Broadband Plan Schema Assignments",
  "change-policies": "Service Change Policy",
  "upgrade-rules": "Package Upgrade Eligibility",
  "change-matrix": "Instant vs WO-based Change Matrix",
  "schema-migration": "Bulk Schema Migration",
};

function ViewContent({ view }: { view: SchemaView }) {
  switch (view) {
    case "schemas": return <SchemaList />;
    case "assignment-rules": return <AssignmentRulesPanel />;
    case "customer-overrides": return <CustomerOverridePanel />;
    case "broadband-plan-schemas": return <BroadbandPlanSchemasPanel />;
    case "change-policies": return <ServiceChangePolicyPanel />;
    case "upgrade-rules": return <UpgradeEligibilityPanel />;
    case "change-matrix": return <ChangeMatrixPanel />;
    case "schema-migration": return <SchemaMigrationView />;
  }
}

const ALL_PANEL_PARAMS = {
  sc_view:  parseAsString,
  sc_type:  parseAsString, sc_search: parseAsString,
  sc_page:  parseAsInteger, sc_limit: parseAsInteger,
  bps_page: parseAsInteger, bps_size: parseAsInteger,
  bps_plan: parseAsString,  bps_search: parseAsString,
  co_page:  parseAsInteger, co_size:  parseAsInteger,
  co_search: parseAsString,
};

export function SchemaManagementPage() {
  const { openSchemaSheet, setView, activeSchemaType } = useSchemaStore();
  const [urlParams, setPanelParams] = useQueryStates(ALL_PANEL_PARAMS);

  const view = (urlParams.sc_view as SchemaView | null) ?? "schemas";

  useEffect(() => { setView(view); }, [view, setView]);

  function handleSetView(v: SchemaView) {
    setPanelParams({
      sc_view: v,
      sc_type: null, sc_search: null, sc_page: null, sc_limit: null,
      bps_page: null, bps_size: null, bps_plan: null, bps_search: null,
      co_page: null, co_size: null, co_search: null,
    });
  }

  const { data: schemaResult } = useSchemaList({ schemaType: activeSchemaType });
  const schemaCount = schemaResult?.metadata?.total ?? schemaResult?.schemas?.length ?? 0;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Schema Management" },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Schema Management
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <RiFileTextLine className="size-3.5" />
              {schemaCount} Schemas
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              {VIEW_TITLES[view]}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          {view === "schemas" && (
            <>
              <Button variant="outline" className="h-9 px-3 text-sm font-semibold shadow-xs sm:h-11 sm:px-5">
                <RiDownloadLine className="size-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                variant="primary"
                className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
                onClick={() => openSchemaSheet("new")}
              >
                <RiAddLine className="size-4 sm:size-5" />
                New Schema
              </Button>
            </>
          )}
        </ToolbarActions>
      </Toolbar>

      <Tabs value={view} onValueChange={(v) => handleSetView(v as SchemaView)} className="mt-4">
        <TabsList variant="line" size="sm" className="w-full justify-start">
          {VIEWS.map((v) => (
            <TabsTrigger key={v.value} value={v.value}>
              {v.icon}
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 flex-1 overflow-auto">
        <ViewContent view={view} />
      </div>

      <SchemaFormSheet />
      <ApprovalPanel />
      <HistoryPanel />
    </div>
  );
}
