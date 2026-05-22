"use client";

import { RiUserSettingsLine } from "@remixicon/react";
import { Monitor, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionItem } from "@/features/user-service/types";
import type { UserData } from "../../../types";

interface AccountSectionProps {
  isDetailMode: boolean;
  selectedUser: UserData | null;
  sessions: SessionItem[];
  isRevoking: boolean;
  revokeSessions: (id: string) => Promise<unknown>;
}

export function AccountSection({
  isDetailMode,
  selectedUser,
  sessions,
  isRevoking,
  revokeSessions,
}: AccountSectionProps) {
  return (
    <>
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
          <RiUserSettingsLine className="size-4 text-slate-500" />
          <h3 className="text-sm font-semibold">Account</h3>
        </div>
        <p className="text-[11px] text-muted-foreground">
          User status and lock state can be managed from the user list actions after creation.
        </p>
      </div>

      {isDetailMode && selectedUser && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-orange-500" />
              <h3 className="text-sm font-semibold">Active Sessions</h3>
              {sessions.length > 0 && (
                <Badge variant="warning" appearance="light" size="sm">
                  {sessions.length}
                </Badge>
              )}
            </div>
            {sessions.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/5 h-7 text-xs"
                onClick={async () => {
                  try {
                    await revokeSessions(selectedUser.id);
                    toast.success("All sessions revoked");
                  } catch {
                    toast.error("Failed to revoke sessions");
                  }
                }}
                disabled={isRevoking}
              >
                <Trash2 className="size-3 mr-1" />
                Revoke All
              </Button>
            )}
          </div>
          {sessions.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">No active sessions</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-md border border-border/60 px-3 py-2 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-muted-foreground">
                      {s.ip_address ?? "Unknown IP"}
                    </span>
                    <Badge
                      variant={s.is_active ? "success" : "secondary"}
                      appearance="light"
                      size="sm"
                    >
                      {s.is_active ? "active" : "expired"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground truncate">{s.user_agent ?? "—"}</p>
                  <p className="text-muted-foreground">
                    Created: {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
