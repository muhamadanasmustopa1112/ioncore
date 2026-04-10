"use client";

import { RiAddLine, RiBuilding2Line, RiDownloadLine } from "@remixicon/react";
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
import { BranchList } from "./list/branch-list";
import { useBranchStore } from "../store/branch";
import { BranchFormSheet } from "./form/branch-form-sheet";
import { DUMMY_BRANCHES } from "../data/dummy-branch";

export function BranchListPage() {
  const { openBranchFormSheet } = useBranchStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Branch Management" },
        ]}
        className="mb-15"
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            Branch Management
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
              <RiBuilding2Line className="size-3.5" />
              {DUMMY_BRANCHES.length} Branches
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              Regional → Area → Sub Area hierarchy
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            Export Data
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openBranchFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            Add New Branch
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="flex-1 overflow-auto mt-4">
        <BranchList />
      </div>

      <BranchFormSheet />
    </div>
  );
}
