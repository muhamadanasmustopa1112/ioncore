"use client";

import { RiAddLine, RiDownloadLine, RiFileTextLine } from "@remixicon/react";
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
import { useSchemaStore } from "../store/schema";
import { SchemaList } from "./list/schema-list";
import { SchemaFormSheet } from "./schema-form-sheet";
import { ApprovalPanel } from "./workflow/approval-panel";
import { HistoryPanel } from "./history/history-panel";
import { MigrationPanel } from "./history/migration-panel";

export function SchemaManagementPage() {
  const { openSchemaSheet } = useSchemaStore();

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
              Onboarding, Billing, Service, Commission, dan Suspension
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
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
        </ToolbarActions>
      </Toolbar>

      <div className="flex-1 overflow-auto mt-4">
        <SchemaList />
      </div>

      <SchemaFormSheet />
      <ApprovalPanel />
      <HistoryPanel />
      <MigrationPanel />
    </div>
  );
}
