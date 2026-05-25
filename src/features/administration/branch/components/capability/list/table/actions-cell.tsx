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
import { CapabilityData } from "../../../../types/capability";
import { useCapabilityStore } from "../../../../store/capability";
import { useDeleteCapability } from "../../../../api/capability-queries";

export function ActionsCell({ row }: { row: Row<CapabilityData> }) {
  const { t } = useTranslation();
  const { openSheet, selectedBranchId } = useCapabilityStore();
  const deleteCapability = useDeleteCapability();
  const capability = row.original;

  const handleDelete = () => {
    deleteCapability.mutate({
      branchId: selectedBranchId,
      capabilityId: capability.id,
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
          onClick={() => openSheet("edit", capability)}
        >
          <RiEditLine />
          {t("administration.branch.capability.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", capability)}
        >
          <RiEyeLine />
          {t("administration.branch.capability.detail")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={deleteCapability.isPending}
          onClick={handleDelete}
        >
          <RiDeleteBin7Line />
          {t("administration.branch.capability.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}