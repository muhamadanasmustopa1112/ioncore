"use client";

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
  const { openSheet, selectedBranchId } = useCoverageStore();
  const deleteCoverage = useDeleteCoverage();
  const coverage = row.original;

  const handleDelete = () => {
    deleteCoverage.mutate({
      branchId: selectedBranchId,
      coverageId: coverage.id,
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("edit", coverage)}
        >
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", coverage)}
        >
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={deleteCoverage.isPending}
          onClick={handleDelete}
        >
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
