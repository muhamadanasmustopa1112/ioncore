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
import { PolicyData } from "../../../../types/policy";
import { usePolicyStore } from "../../../../store/policy";
import { useDeletePolicy } from "../../../../api/policy-queries";

export function ActionsCell({ row }: { row: Row<PolicyData> }) {
  const { t } = useTranslation();
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
          {t("administration.branch.policy.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", policy)}
        >
          <RiEyeLine />
          {t("administration.branch.policy.detail")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={deletePolicy.isPending}
          onClick={handleDelete}
        >
          <RiDeleteBin7Line />
          {t("administration.branch.policy.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}