"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScanResultBadgeProps {
  success: boolean;
  label: string;
  value?: string;
}

export function ScanResultBadge({ success, label, value }: ScanResultBadgeProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
      {success ? (
        <CheckCircle2 className="size-4 text-success shrink-0" />
      ) : ( 
        <XCircle className="size-4 text-destructive shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
        <p className="text-xs font-mono text-foreground truncate">
          {value || "Not scanned"}
        </p>
      </div>
      {success && (
        <Badge variant="success" appearance="light" className="text-[9px] px-1.5 py-0.5 shrink-0">
          OK
        </Badge>
      )}
    </div>
  );
}
