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
  const status = schema.schema_status?.toUpperCase();

  const isDraft = status === "DRAFT";
  const isReview = status === "REVIEW";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isPublished = status === "PUBLISHED";
  const isArchived = status === "ARCHIVED";

  const canEdit = isDraft || isPublished;
  const canSubmitOrPublish = isDraft || isReview || isApproved || isRejected;
  const canClone = !isArchived;

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

        {canEdit && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedSchemaId(schema.id);
              openSchemaSheet("edit");
            }}
          >
            <RiEditLine />
            Edit
          </DropdownMenuItem>
        )}

        {canClone && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedSchemaId(schema.id);
              openSchemaSheet("clone");
            }}
          >
            <RiFileCopyLine />
            Clone
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {canSubmitOrPublish && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openApprovalPanel(schema.id)}
          >
            <RiSendPlaneLine />
            {isDraft ? "Submit for Review" : isReview ? "Review Status" : isRejected ? "Review Rejected" : "Publish"}
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
