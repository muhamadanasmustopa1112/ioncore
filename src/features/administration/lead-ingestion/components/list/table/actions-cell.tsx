"use client";

import { RiDeleteBin7Line, RiEditLine, RiExchangeLine, RiEyeLine } from "@remixicon/react";
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
import { ExternalSource } from "../../../types/lead-ingestion";
import { useLeadIngestionStore } from "../../../store/lead-ingestion";

export function ActionsCell({ row }: { row: Row<ExternalSource> }) {
  const openForm = useLeadIngestionStore((s) => s.openForm);
  const openMapping = useLeadIngestionStore((s) => s.openMapping);
  const removeSource = useLeadIngestionStore((s) => s.removeSource);
  const toggleStatus = useLeadIngestionStore((s) => s.toggleStatus);
  const source = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openMapping(source)}>
          <RiExchangeLine />
          Mapping & Test Ingest
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openForm("edit", source)}>
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openForm("details", source)}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => toggleStatus(source.id)}>
          {source.status === "active" ? "Disable" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => removeSource(source.id)}
        >
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
