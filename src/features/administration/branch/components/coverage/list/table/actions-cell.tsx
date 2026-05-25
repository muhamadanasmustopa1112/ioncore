"use client";

import { useTranslation } from "react-i18next";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CoverageData } from "../../../../types/coverage";
import { useCoverageStore } from "../../../../store/coverage";
import { useDeleteCoverage } from "../../../../api/coverage-queries";

export function ActionsCell({ row }: { row: Row<CoverageData> }) {
  const { t } = useTranslation();
  const { openSheet, selectedBranchId } = useCoverageStore();
  const deleteCoverage = useDeleteCoverage();
  const coverageArea = row.original;

  const handleDelete = () => {
    deleteCoverage.mutate({
      branchId: selectedBranchId,
      coverageId: coverageArea.id,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("edit", coverageArea)}
        >
          <RiEditLine />
          {t("administration.branch.coverage.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", coverageArea)}
        >
          <RiEyeLine />
          {t("administration.branch.coverage.detail")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={deleteCoverage.isPending}
          onClick={handleDelete}
        >
          <RiDeleteBin7Line />
          {t("administration.branch.coverage.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}