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
import { PolicyData } from "../../../../types/policy";
import { usePolicyStore } from "../../../../store/policy";
import { useDeletePolicy } from "../../../../api/policy-queries";

export function ActionsCell({ row }: { row: Row<PolicyData> }) {
  const { openSheet, selectedBranchId } = usePolicyStore();
  const deletePolicy = useDeletePolicy();
  const policy = row.original;

  const handleDelete = () => {
    deletePolicy.mutate({ branchId: selectedBranchId, policyId: policy.id });
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
          onClick={() => openSheet("edit", policy)}
        >
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", policy)}
        >
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={deletePolicy.isPending}
          onClick={handleDelete}
        >
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
