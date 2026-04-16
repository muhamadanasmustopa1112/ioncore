"use client";

import { RiAddLine, RiGroupLine } from "@remixicon/react";
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
import { useResourceMappingStore } from "../../store/resource-mapping";
import { ResourceMappingList } from "./list/resource-mapping-list";
import { ResourceMappingFormSheet } from "./form/resource-mapping-form-sheet";

export function BranchResourceMappingPage() {
  const openSheet = useResourceMappingStore((s) => s.openSheet);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          {
            title: "Branch Management",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Branch Resource Mapping" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Branch Resource Mapping
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <RiGroupLine className="size-3.5" />
              Resource Assignment
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              Assign Sales Reps, Team Leaders, Warehouses, and NOC teams to branch nodes
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          <Button
            variant="primary"
            className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
            onClick={() => openSheet("new")}
          >
            <RiAddLine className="size-4 sm:size-5" />
            Add Mapping
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4">
        <ResourceMappingList />
      </div>

      <ResourceMappingFormSheet />
    </div>
  );
}
