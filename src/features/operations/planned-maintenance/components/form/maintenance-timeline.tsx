"use client";

import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  CheckSquare,
  Info,
  Megaphone,
  Wrench,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { MaintenanceTimelineEntry, TimelineEntryType } from "../../types";

const ENTRY_CONFIG: Record<
  TimelineEntryType,
  { icon: React.ElementType; color: string }
> = {
  scheduled: { icon: Calendar, color: "text-blue-500" },
  approval: { icon: CheckCircle, color: "text-green-500" },
  update: { icon: Info, color: "text-gray-500" },
  broadcast: { icon: Megaphone, color: "text-purple-500" },
  task: { icon: CheckSquare, color: "text-orange-500" },
  wo: { icon: Wrench, color: "text-cyan-500" },
  completed: { icon: CheckCircle, color: "text-green-600" },
  cancelled: { icon: XCircle, color: "text-red-500" },
  escalation: { icon: AlertTriangle, color: "text-red-600" },
};

export function MaintenanceTimeline({
  timeline,
}: {
  timeline: MaintenanceTimelineEntry[];
}) {
  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No timeline entries yet.
      </p>
    );
  }

  const sorted = [...timeline].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="relative space-y-0">
      {sorted.map((entry, index) => {
        const config = ENTRY_CONFIG[entry.entry_type] || ENTRY_CONFIG.update;
        const Icon = config.icon;
        const isLast = index === sorted.length - 1;

        return (
          <div key={entry.id} className="relative flex gap-3 pb-4">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-background border ${config.color}`}
            >
              <Icon className="size-3" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium capitalize">
                  {entry.entry_type.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {format(new Date(entry.created_at), "dd MMM yyyy, HH:mm")}
                </span>
              </div>
              <p className="text-sm text-foreground mt-0.5">
                {entry.entry_text}
              </p>
              <p className="text-xs text-muted-foreground">
                by {entry.created_by}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
