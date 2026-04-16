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
import { CrossBranchRuleData } from "../../../../types/cross-branch-rules";
import { useCrossBranchRulesStore } from "../../../../store/cross-branch-rules";

export function ActionsCell({ row }: { row: Row<CrossBranchRuleData> }) {
  const { openSheet } = useCrossBranchRulesStore();
  const rule = row.original;

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
          onClick={() => openSheet("edit", rule)}
        >
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openSheet("details", rule)}
        >
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="cursor-pointer">
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
