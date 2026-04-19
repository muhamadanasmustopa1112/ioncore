"use client";

import { useState } from "react";
import { GitBranch, CheckCircle, XCircle, Send, Archive, Copy, Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useTemplateList } from "../../api/checklist-template-queries";
import {
  useVersionList,
  useSubmitForApproval,
  useApproveVersion,
  useRejectVersion,
  usePublishVersion,
  useArchiveVersion,
  useCloneVersionAsDraft,
} from "../../api/versioning-queries";
import { useVersioningStore } from "../../store/versioning";
import type { SchemaVersion, VersionStatus } from "../../types/versioning";
import { VERSION_STATUS_LABELS, VERSION_STATUS_VARIANTS } from "../../types/versioning";

// ─── Approval Sheet ──────────────────────────────────────────────────────────

function ApprovalSheet() {
  const sheetOpen = useVersioningStore((s) => s.sheetOpen);
  const closeSheet = useVersioningStore((s) => s.closeSheet);
  const sheetMode = useVersioningStore((s) => s.sheetMode);
  const selectedVersion = useVersioningStore((s) => s.selectedVersion);

  const [changeReason, setChangeReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectMode, setRejectMode] = useState(false);

  const submitForApproval = useSubmitForApproval();
  const approveVersion = useApproveVersion();
  const rejectVersion = useRejectVersion();
  const publishVersion = usePublishVersion();

  if (!selectedVersion) return null;

  const isApproveMode = sheetMode === "approve";
  const v = selectedVersion;

  const handleSubmit = () => {
    submitForApproval.mutate(
      { templateId: v.templateId, versionId: v.id, changeReason },
      { onSuccess: closeSheet }
    );
  };

  const handleApprove = () => {
    approveVersion.mutate(
      { templateId: v.templateId, versionId: v.id, notes: approvalNotes },
      { onSuccess: closeSheet }
    );
  };

  const handleReject = () => {
    rejectVersion.mutate(
      { templateId: v.templateId, versionId: v.id, reason: rejectionReason },
      { onSuccess: closeSheet }
    );
  };

  const handlePublish = () => {
    publishVersion.mutate(
      { templateId: v.templateId, versionId: v.id, changeReason },
      { onSuccess: closeSheet }
    );
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isApproveMode ? "Review & Approve" : "Submit for Approval"}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-auto p-5 space-y-4">
          <div className="rounded-md bg-muted/30 p-3 text-sm">
            <p className="font-medium">Version {v.versionNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Status: <span className="capitalize">{VERSION_STATUS_LABELS[v.status]}</span>
            </p>
          </div>

          {/* Approval chain */}
          {v.approvalChain.length > 0 && (
            <div>
              <Label className="text-xs mb-2 block">Approvers</Label>
              <div className="space-y-2">
                {v.approvalChain.map((a) => (
                  <div key={a.approverId} className="flex items-center gap-3 rounded-md border px-3 py-2">
                    {a.status === "approved" ? (
                      <CheckCircle className="size-4 text-success shrink-0" />
                    ) : a.status === "rejected" ? (
                      <XCircle className="size-4 text-destructive shrink-0" />
                    ) : (
                      <div className="size-4 rounded-full border-2 border-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.approverName}</p>
                      <p className="text-xs text-muted-foreground">{a.approverRole}</p>
                    </div>
                    {a.approvedAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.approvedAt).toLocaleDateString("id-ID")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit for approval form */}
          {(v.status === "draft" || v.status === "approved") && (
            <div className="space-y-1.5">
              <Label className="text-xs">Change Reason *</Label>
              <Textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Describe what changed in this version..."
                rows={3}
              />
            </div>
          )}

          {/* Approve form */}
          {isApproveMode && v.status === "pending_approval" && !rejectMode && (
            <div className="space-y-1.5">
              <Label className="text-xs">Approval Notes (optional)</Label>
              <Textarea value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={2} />
            </div>
          )}

          {/* Reject form */}
          {rejectMode && (
            <div className="space-y-1.5">
              <Label className="text-xs">Rejection Reason *</Label>
              <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={2} />
            </div>
          )}
        </SheetBody>

        <div className="border-t p-5 pb-4 flex gap-2.5 justify-end">
          <Button variant="ghost" onClick={closeSheet}>Close</Button>

          {v.status === "draft" && (
            <Button variant="primary" onClick={handleSubmit} disabled={!changeReason || submitForApproval.isPending} className="font-semibold">
              <Send className="size-4" />
              {submitForApproval.isPending ? "Submitting..." : "Submit for Approval"}
            </Button>
          )}

          {v.status === "approved" && (
            <Button variant="primary" onClick={handlePublish} disabled={!changeReason || publishVersion.isPending} className="font-semibold">
              {publishVersion.isPending ? "Publishing..." : "Publish Version"}
            </Button>
          )}

          {isApproveMode && v.status === "pending_approval" && (
            <>
              {!rejectMode ? (
                <>
                  <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => setRejectMode(true)}>
                    <XCircle className="size-4" /> Reject
                  </Button>
                  <Button variant="primary" onClick={handleApprove} disabled={approveVersion.isPending} className="font-semibold">
                    <CheckCircle className="size-4" />
                    {approveVersion.isPending ? "Approving..." : "Approve"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setRejectMode(false)}>Back</Button>
                  <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason || rejectVersion.isPending}>
                    {rejectVersion.isPending ? "Rejecting..." : "Confirm Reject"}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Version Row ─────────────────────────────────────────────────────────────

function VersionRow({ version, isLoggedInApprover = false }: { version: SchemaVersion; isLoggedInApprover?: boolean }) {
  const openSheet = useVersioningStore((s) => s.openSheet);
  const archiveVersion = useArchiveVersion();
  const cloneVersion = useCloneVersionAsDraft();

  const canSubmit = version.status === "draft";
  const canApprove = version.status === "pending_approval" && isLoggedInApprover;
  const canPublish = version.status === "approved";
  const canArchive = version.status === "published";
  const canClone = version.status === "published" || version.status === "archived";

  return (
    <tr className="hover:bg-muted/20">
      <td className="px-4 py-3">
        <span className="font-mono text-sm">v{version.versionNumber}</span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={VERSION_STATUS_VARIANTS[version.status]} appearance="light" className="text-xs capitalize">
          {VERSION_STATUS_LABELS[version.status]}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{version.createdByName}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(version.createdAt).toLocaleDateString("id-ID")}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {version.publishedAt ? new Date(version.publishedAt).toLocaleDateString("id-ID") : "—"}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
        {version.changeReason ?? "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          {canSubmit && (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openSheet("approve", version)}>
              <Send className="size-3.5 mr-1" />Submit
            </Button>
          )}
          {canApprove && (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-success hover:text-success" onClick={() => openSheet("approve", version)}>
              <CheckCircle className="size-3.5 mr-1" />Review
            </Button>
          )}
          {canPublish && (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-info hover:text-info" onClick={() => openSheet("approve", version)}>
              Publish
            </Button>
          )}
          {canClone && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Create draft from this version" onClick={() => cloneVersion.mutate({ templateId: version.templateId, versionId: version.id })}>
              <Copy className="size-3.5" />
            </Button>
          )}
          {canArchive && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => archiveVersion.mutate({ templateId: version.templateId, versionId: version.id })}>
              <Archive className="size-3.5" />
            </Button>
          )}
          {(version.status === "pending_approval" && !isLoggedInApprover) && (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openSheet("diff", version)}>
              <Eye className="size-3.5 mr-1" />View
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Version List ─────────────────────────────────────────────────────────────

function VersionList({ templateId }: { templateId: string }) {
  const { data: versions = [], isLoading } = useVersionList(templateId);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Version</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Created By</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Created</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Published</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Change Reason</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {versions.length === 0 && (
            <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-xs">No versions yet</td></tr>
          )}
          {versions.map((v) => (
            <VersionRow key={v.id} version={v} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ChecklistVersioningPage() {
  const { data: templates = [], isLoading: templatesLoading } = useTemplateList();
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Checklist" },
          { title: "Versioning & Publish" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Checklist Versioning &amp; Publish
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <GitBranch className="size-3.5" />
              Draft → Approval → Published
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>

      {/* Template selector */}
      <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Select Template:</span>
        <Select value={selectedTemplateId || "none"} onValueChange={(v) => setSelectedTemplateId(v === "none" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Choose a template to view versions..." />
          </SelectTrigger>
          <SelectContent>
            {templatesLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.schemaName} <span className="text-muted-foreground">({t.woType})</span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        {selectedTemplateId ? (
          <VersionList templateId={selectedTemplateId} />
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
            <GitBranch className="size-10 opacity-30" />
            <p className="text-sm font-medium">Select a template to view its version history</p>
          </div>
        )}
      </div>

      <ApprovalSheet />
    </div>
  );
}
