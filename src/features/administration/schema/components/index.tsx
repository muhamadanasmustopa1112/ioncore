"use client";

import {
  RiAddLine,
  RiDownloadLine,
  RiFileTextLine,
  RiGroupLine,
  RiUserSettingsLine,
  RiRefreshLine,
  RiArrowUpLine,
  RiGridLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_SCHEMAS } from "../data/dummy-schemas";
import { useSchemaStore, SchemaView } from "../store/schema";
import { SchemaList } from "./list/schema-list";
import { SchemaFormSheet } from "./schema-form-sheet";
import { ApprovalPanel } from "./workflow/approval-panel";
import { HistoryPanel } from "./history/history-panel";
import { MigrationPanel } from "./history/migration-panel";
import { AssignmentRulesPanel } from "./policy/assignment-rules-panel";
import { CustomerOverridePanel } from "./policy/customer-override-panel";
import { ServiceChangePolicyPanel } from "./policy/service-change-policy-panel";
import { UpgradeEligibilityPanel } from "./policy/upgrade-eligibility-panel";
import { ChangeMatrixPanel } from "./policy/change-matrix-panel";

const VIEWS: { value: SchemaView; label: string; icon: React.ReactNode }[] = [
  { value: "schemas", label: "Schema Library", icon: <RiFileTextLine className="size-3.5" /> },
  { value: "assignment-rules", label: "Assignment Rules", icon: <RiGroupLine className="size-3.5" /> },
  { value: "customer-overrides", label: "Customer Overrides", icon: <RiUserSettingsLine className="size-3.5" /> },
  { value: "change-policies", label: "Change Policies", icon: <RiRefreshLine className="size-3.5" /> },
  { value: "upgrade-rules", label: "Upgrade Eligibility", icon: <RiArrowUpLine className="size-3.5" /> },
  { value: "change-matrix", label: "Change Matrix", icon: <RiGridLine className="size-3.5" /> },
];

const VIEW_TITLES: Record<SchemaView, string> = {
  "schemas": "Schema Library",
  "assignment-rules": "Assignment Rules Manager",
  "customer-overrides": "Per-Customer Schema Override",
  "change-policies": "Service Change Policy",
  "upgrade-rules": "Package Upgrade Eligibility",
  "change-matrix": "Instant vs WO-based Change Matrix",
};

function ViewContent({ view }: { view: SchemaView }) {
  switch (view) {
    case "schemas": return <SchemaList />;
    case "assignment-rules": return <AssignmentRulesPanel />;
    case "customer-overrides": return <CustomerOverridePanel />;
    case "change-policies": return <ServiceChangePolicyPanel />;
    case "upgrade-rules": return <UpgradeEligibilityPanel />;
    case "change-matrix": return <ChangeMatrixPanel />;
  }
}

export function SchemaManagementPage() {
  const { openSchemaSheet, view, setView } = useSchemaStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Schema Management" },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            Schema Management
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
              <RiFileTextLine className="size-3.5" />
              {DUMMY_SCHEMAS.length} Schemas
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              {VIEW_TITLES[view]}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          {view === "schemas" && (
            <>
              <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
                <RiDownloadLine className="size-4" />
                Export
              </Button>
              <Button
                variant="primary"
                className="h-11 px-6 font-semibold shadow-md"
                onClick={() => openSchemaSheet("new")}
              >
                <RiAddLine className="size-5" />
                New Schema
              </Button>
            </>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* View switcher */}
      <div className="flex items-center gap-1 mt-4 border-b overflow-x-auto">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            onClick={() => setView(v.value)}
            className={[
              "flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              view === v.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {v.icon}
            {v.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-auto">
        <ViewContent view={view} />
      </div>

      <SchemaFormSheet />
      <ApprovalPanel />
      <HistoryPanel />
      <MigrationPanel />
    </div>
  );
}
