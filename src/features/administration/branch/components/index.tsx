"use client";

import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
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
import { useRegionalList, useBranchListPaginated } from "../api/branch-queries";

export function BranchListPage() {
  const { t } = useTranslation();
  const openBranchFormSheet = useBranchStore((s) => s.openBranchFormSheet);
  const searchParams = useSearchParams();
  const activeType = searchParams.get("branch_type") ?? "office";
  const { data: countResult } = useBranchListPaginated({ page: 1, per_page: 1 });
  const totalBranches = countResult?.total ?? 0;
  useRegionalList();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.administration"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.branch.branchManagement") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("administration.branch.branchManagement")}
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <RiBuilding2Line className="size-3.5" />
              {totalBranches} {t("administration.branch.branches")}
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              {t("administration.branch.hierarchyInfo")}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          <Button variant="outline" className="h-9 px-4 text-sm font-semibold shadow-xs sm:h-11 sm:px-5">
            <RiDownloadLine className="size-4" />
            {t("administration.branch.exportData")}
          </Button>
          <Button
            variant="primary"
            className="h-9 px-4 text-sm font-semibold shadow-md sm:h-11 sm:px-6"
            onClick={() => openBranchFormSheet("new", undefined, activeType === "all" ? "office" : activeType)}
          >
            <RiAddLine className="size-4 sm:size-5" />
            {t("administration.branch.addNewBranch")}
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