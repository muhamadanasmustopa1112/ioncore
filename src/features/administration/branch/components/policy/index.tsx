"use client";

import { RiAddLine, RiShieldLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BranchCombobox } from "../branch-combobox";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useBranchSelect } from "../use-branch-select";
import { usePolicyStore } from "../../store/policy";
import { PolicyList } from "./list/policy-list";
import { PolicyFormSheet } from "./form/policy-form-sheet";


export function BranchPolicyPage() {
  const { branches, isLoading, onSearchChange } = useBranchSelect();
  const openSheet = usePolicyStore((s) => s.openSheet);
  const selectedBranchId = usePolicyStore((s) => s.selectedBranchId);
  const setSelectedBranchId = usePolicyStore((s) => s.setSelectedBranchId);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

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
          { title: "Branch Policies" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Branch Policies
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="warning"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <RiShieldLine className="size-3.5" />
              SLA & Compliance
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              Configure SLA, working hours, and approval rules per branch
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          <Button
            variant="primary"
            className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
            disabled={!selectedBranchId}
            onClick={() => openSheet("new")}
          >
            <RiAddLine className="size-4 sm:size-5" />
            Add Policy
          </Button>
        </ToolbarActions>
      </Toolbar>

      {/* Branch Selector */}
      <div className="mt-4 flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Select Branch:
        </span>
        <BranchCombobox
          branches={branches}
          value={selectedBranchId || ""}
          onValueChange={setSelectedBranchId}
          onSearchChange={onSearchChange}
          isLoading={isLoading}
        />
        {selectedBranch && (
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {selectedBranch.code}
          </span>
        )}
      </div>

      {/* List */}
      {selectedBranchId ? (
        <div className="flex-1 overflow-auto mt-2">
          <PolicyList branchId={selectedBranchId} />
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
          <RiShieldLine className="size-10 opacity-30" />
          <p className="text-sm font-medium">Select a branch to view policies</p>
          <p className="text-xs opacity-70">
            Choose a Regional, Area, or Sub Area branch from the selector above.
          </p>
        </div>
      )}

      <PolicyFormSheet />
    </div>
  );
}
