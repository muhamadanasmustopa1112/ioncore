"use client";

import { RiCheckLine, RiCloseLine, RiEyeLine, RiTimeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDuplicateReviewStore } from "../../../store/duplicate-review";
import type { DuplicatePair } from "../../../types/duplicate-review";

export function ActionsCell({ row }: { row: Row<DuplicatePair> }) {
  const openReview = useDuplicateReviewStore((s) => s.openReview);
  const resolvePair = useDuplicateReviewStore((s) => s.resolvePair);
  const pair = row.original;
  const isPending = pair.status === "pending" || pair.status === "deferred";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openReview(pair)}>
          <RiEyeLine />
          Review
        </DropdownMenuItem>
        {isPending && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => resolvePair(pair.id, "dismissed")}
            >
              <RiCloseLine />
              Dismiss (not duplicate)
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => resolvePair(pair.id, "deferred")}
            >
              <RiTimeLine />
              Defer
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-emerald-600 focus:text-emerald-600"
              onClick={() => openReview(pair)}
            >
              <RiCheckLine />
              Merge…
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
