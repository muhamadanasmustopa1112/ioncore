"use client";

import { RiAddLine, RiSettings3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useBranchTree } from "../../api/branch-queries";
import { useCapabilityStore } from "../../store/capability";
import { CapabilityList } from "./list/capability-list";
import { CapabilityFormSheet } from "./form/capability-form-sheet";

const levelLabel: Record<string, string> = {
  regional: "Regional",
  area: "Area",
  sub_area: "Sub Area",
};

export function BranchCapabilityPage() {
  const { data: branches = [] } = useBranchTree();
  const { openSheet, selectedBranchId, setSelectedBranchId } =
    useCapabilityStore();

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
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
          { title: "Capability Configuration" },
        ]}
      />

      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            Branch Capability Configuration
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 px-2.5 gap-1.5 border-none font-semibold"
            >
              <RiSettings3Line className="size-3.5" />
              Feature Capabilities
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              Configure which features are enabled per branch
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            disabled={!selectedBranchId}
            onClick={() => openSheet("new")}
          >
            <RiAddLine className="size-5" />
            Add Capability
          </Button>
        </ToolbarActions>
      </Toolbar>

      {/* Branch Selector */}
      <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Select Branch:
        </span>
        <Select
          value={selectedBranchId || "none"}
          onValueChange={(v) => setSelectedBranchId(v === "none" ? "" : v)}
        >
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choose a branch to manage..." />
          </SelectTrigger>
          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16 shrink-0">
                    {levelLabel[b.level]}
                  </span>
                  {b.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedBranch && (
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {selectedBranch.code}
          </span>
        )}
      </div>

      {/* List — only shown when branch is selected */}
      {selectedBranchId ? (
        <div className="flex-1 overflow-auto mt-2">
          <CapabilityList branchId={selectedBranchId} />
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
          <RiSettings3Line className="size-10 opacity-30" />
          <p className="text-sm font-medium">Select a branch to view capabilities</p>
          <p className="text-xs opacity-70">
            Choose a Regional, Area, or Sub Area branch from the selector above.
          </p>
        </div>
      )}

      <CapabilityFormSheet />
    </div>
  );
}
