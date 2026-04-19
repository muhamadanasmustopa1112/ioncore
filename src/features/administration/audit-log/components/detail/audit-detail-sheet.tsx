"use client";

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AuditLog } from "../../types/audit-log";

interface AuditDetailSheetProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

function JsonDiff({
  before,
  after,
}: {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}) {
  if (!before && !after) return <p className="text-muted-foreground text-sm">No data recorded.</p>;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Before</p>
        <pre className="text-xs bg-muted/60 rounded-md p-3 overflow-auto max-h-72 whitespace-pre-wrap">
          {before ? JSON.stringify(before, null, 2) : "—"}
        </pre>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">After</p>
        <pre className="text-xs bg-muted/60 rounded-md p-3 overflow-auto max-h-72 whitespace-pre-wrap">
          {after ? JSON.stringify(after, null, 2) : "—"}
        </pre>
      </div>
    </div>
  );
}

export function AuditDetailSheet({ log, open, onClose }: AuditDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[680px] lg:w-[780px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">Audit Log Detail</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            {log && (
              <div className="p-5 space-y-5">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        dateStyle: "long",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant={log.status === "success" ? "success" : log.status === "partial" ? "warning" : "destructive"}
                      appearance="light"
                      className="capitalize mt-0.5"
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="font-medium">{log.userName}</p>
                    <p className="text-xs text-muted-foreground">{log.userEmail} · {log.userRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Action</p>
                    <Badge variant="info" appearance="light" className="capitalize mt-0.5">
                      {log.actionType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Module</p>
                    <p className="font-medium capitalize">{log.module.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{log.section}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Record</p>
                    <p className="font-medium">{log.recordIdentifier}</p>
                    <p className="text-xs text-muted-foreground">{log.recordType} · {log.recordId}</p>
                  </div>
                  {log.ipAddress && (
                    <div>
                      <p className="text-xs text-muted-foreground">IP Address</p>
                      <p className="font-mono text-sm">{log.ipAddress}</p>
                    </div>
                  )}
                  {log.sessionId && (
                    <div>
                      <p className="text-xs text-muted-foreground">Session ID</p>
                      <p className="font-mono text-xs text-muted-foreground truncate">{log.sessionId}</p>
                    </div>
                  )}
                </div>

                {/* Change reason */}
                {log.changeReason && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Change Reason</p>
                    <p className="text-sm bg-muted/40 rounded-md px-3 py-2">{log.changeReason}</p>
                  </div>
                )}

                {/* Error message */}
                {log.errorMessage && (
                  <div>
                    <p className="text-xs text-destructive mb-1">Error</p>
                    <p className="text-sm bg-destructive/10 text-destructive rounded-md px-3 py-2">
                      {log.errorMessage}
                    </p>
                  </div>
                )}

                {/* Before / After diff */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Changes
                  </p>
                  <JsonDiff before={log.before} after={log.after} />
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
