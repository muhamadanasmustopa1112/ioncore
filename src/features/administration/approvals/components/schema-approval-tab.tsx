"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCan } from "@/lib/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useSchemaList, useAddApprovalDecision } from "@/features/administration/schema/api/schema-queries";
import { listSchemaVersions } from "@/features/administration/schema/api/schema-api";
import type { SchemaRecord } from "@/features/administration/schema/types";

const REVIEW_STATUSES = new Set(["REVIEW", "SUBMITTED", "PENDING"]);

export function SchemaApprovalTab() {
  const { t } = useTranslation();
  const canApprove = useCan(PERMISSIONS.schema.approve);
  const { data, isLoading, refetch } = useSchemaList({ size: 200 });
  const addDecision = useAddApprovalDecision();

  const [dialog, setDialog] = useState<{
    schema: SchemaRecord;
    decision: "APPROVED" | "REJECTED";
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [resolving, setResolving] = useState(false);

  const pending = useMemo(
    () =>
      (data?.schemas ?? []).filter((s) =>
        REVIEW_STATUSES.has((s.schema_status || "").toUpperCase()),
      ),
    [data?.schemas],
  );

  const handleConfirm = async () => {
    if (!dialog) return;
    setResolving(true);
    try {
      const versionsRes = await listSchemaVersions(dialog.schema.id);
      const versionId = versionsRes.data?.schema_versions?.[0]?.id;
      if (!versionId) {
        throw new Error("No version found for this schema");
      }
      await addDecision.mutateAsync({
        versionId,
        payload: { decision: dialog.decision, notes: notes.trim() || undefined },
      });
      setDialog(null);
      setNotes("");
      await refetch();
    } catch {
      // toast from mutation
    } finally {
      setResolving(false);
    }
  };

  if (!canApprove) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t("administration.approvalCenter.noSchemaPermission")}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        {t("common.loading")}
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t("administration.approvalCenter.emptySchema")}
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("administration.approvalCenter.colName")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colType")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colVersion")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colStatus")}</TableHead>
            <TableHead className="text-right">{t("administration.approvalCenter.colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pending.map((schema) => (
            <TableRow key={schema.id}>
              <TableCell className="font-medium">{schema.name}</TableCell>
              <TableCell className="capitalize text-muted-foreground">
                {schema.schema_type?.replace(/_/g, " ")}
              </TableCell>
              <TableCell>{schema.latest_version || "—"}</TableCell>
              <TableCell>
                <Badge variant="warning" appearance="light" size="sm">
                  {(schema.schema_status || "").replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={addDecision.isPending || resolving}
                    onClick={() => {
                      setNotes("");
                      setDialog({ schema, decision: "APPROVED" });
                    }}
                  >
                    <RiCheckLine className="size-4 mr-1" />
                    {t("administration.approvalCenter.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={addDecision.isPending || resolving}
                    onClick={() => {
                      setNotes("");
                      setDialog({ schema, decision: "REJECTED" });
                    }}
                  >
                    <RiCloseLine className="size-4 mr-1" />
                    {t("administration.approvalCenter.reject")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialog?.decision === "APPROVED"
                ? t("administration.approvalCenter.confirmApproveSchema")
                : t("administration.approvalCenter.confirmRejectSchema")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialog?.schema.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder={t("administration.approvalCenter.notesOptional")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resolving}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirm();
              }}
              disabled={resolving}
            >
              {resolving && <Loader2 className="size-4 animate-spin mr-2" />}
              {dialog?.decision === "APPROVED"
                ? t("administration.approvalCenter.approve")
                : t("administration.approvalCenter.reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
