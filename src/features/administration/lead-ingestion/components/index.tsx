"use client";

import { RiAddLine, RiDownloadCloud2Line } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { useLeadIngestionStore } from "../store/lead-ingestion";
import { SourcesList } from "./list/sources-list";
import { LeadIngestionSheet } from "./lead-ingestion-sheet";

export function LeadIngestionPage() {
  const openForm = useLeadIngestionStore((s) => s.openForm);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Lead Ingestion" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            API Lead Ingestion & Mapping
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <RiDownloadCloud2Line className="size-3.5" />
              External Sources
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              Register external lead feeds and map their payload fields to internal lead schema
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          <Button
            variant="primary"
            className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
            onClick={() => openForm("new")}
          >
            <RiAddLine className="size-4 sm:size-5" />
            Add Source
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4">
        <SourcesList />
      </div>

      <LeadIngestionSheet />
    </div>
  );
}
