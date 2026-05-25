"use client";

import { useTranslation } from "react-i18next";
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
import { useCan } from "@/lib/permissions";
import { SchemaRecord } from "../../../types";
import { useSchemaStore } from "../../../store/schema";

export function ActionsCell({ row }: { row: Row<SchemaRecord> }) {
  const { t } = useTranslation();
  const { setSelectedSchemaId, openSchemaSheet, openApprovalPanel, openHistoryPanel } =
    useSchemaStore();
  const canApprove = useCan("schema.approve");

  const schema = row.original;
  const status = schema.schema_status?.toUpperCase();

  const isDraft = status === "DRAFT";
  const isReview = status === "REVIEW";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isPublished = status === "PUBLISHED";
  const isArchived = status === "ARCHIVED";
  const isRollback = status === "ROLLBACK";

  const isRollbackAlreadyPublished =
    isRollback && schema.latest_version === schema.latest_published_version;

  const canEdit = isDraft || isPublished || isRollback || isRejected;
  const canSubmitOrPublish =
    (isDraft || isReview || isApproved || isRejected || isRollback) &&
    !isRollbackAlreadyPublished;
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
          {t("administration.schema.actionViewDetails")}
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
            {t("administration.schema.actionEdit")}
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
            {t("administration.schema.actionClone")}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {canSubmitOrPublish && (!isReview || canApprove) && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openApprovalPanel(schema.id)}
          >
            <RiSendPlaneLine />
            {isDraft ? t("administration.schema.actionSubmitReview") : isReview ? t("administration.schema.actionReviewStatus") : isRejected ? t("administration.schema.actionReviewRejected") : t("administration.schema.actionPublish")}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openHistoryPanel(schema.id)}
        >
          <RiHistoryLine />
          {t("administration.schema.actionVersionHistory")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
