"use client";

import { useRouter } from "next/navigation";
import { RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/config/paths";
import { Ticket } from "@/features/customer-service/types";

export function ActionsCell({ row }: { row: Row<Ticket> }) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(paths.dashboard.customerService.tickets.detail.getHref(row.original.id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost" aria-label="Ticket actions">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleViewDetail}>
          <RiEyeLine />
          View Detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
