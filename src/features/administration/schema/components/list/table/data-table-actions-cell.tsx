"use client";

import {
  RiEyeLine,
  RiEditLine,
  RiFileCopyLine,
  RiSendPlaneLine,
  RiHistoryLine,
} from "@remixicon/react";
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
import { SchemaRecord } from "../../../types";
import { useSchemaStore } from "../../../store/schema";

export function ActionsCell({ row }: { row: Row<SchemaRecord> }) {
  const { setSelectedSchemaId, openSchemaSheet, openApprovalPanel, openHistoryPanel } =
    useSchemaStore();

  const schema = row.original;
  const isDraft = schema.status === "draft";

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
          onClick={() => {
            setSelectedSchemaId(schema.id);
            openSchemaSheet("details");
          }}
        >
          <RiEyeLine />
          View Details
        </DropdownMenuItem>

        {isDraft && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedSchemaId(schema.id);
              openSchemaSheet("edit");
            }}
          >
            <RiEditLine />
            Edit Draft
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedSchemaId(schema.id);
            openSchemaSheet("new");
          }}
        >
          <RiFileCopyLine />
          Clone
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isDraft && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openApprovalPanel(schema.id)}
          >
            <RiSendPlaneLine />
            Submit for Approval
          </DropdownMenuItem>
        )}

        {schema.status === "approved" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              openApprovalPanel(schema.id);
            }}
          >
            <RiSendPlaneLine className="mr-2 size-4" /> Publish
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openHistoryPanel(schema.id)}
        >
          <RiHistoryLine />
          Version History
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
