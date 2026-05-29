"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { SlaStatus } from "../types";

type SlaStatusBadgeProps = {
  status: SlaStatus;
  className?: string;
};

const STATUS_CONFIG: Record<SlaStatus, { dot: string; text: string; bg: string }> = {
  green: {
    dot: "bg-green-500",
    text: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  yellow: {
    dot: "bg-yellow-500",
    text: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
  },
  red: {
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
  },
};

const STATUS_LABELS: Record<SlaStatus, string> = {
  green: "On Track",
  yellow: "At Risk",
  red: "Breached",
};

export function SlaStatusBadge({ status, className }: SlaStatusBadgeProps) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {t(`sla.status.${status}`, STATUS_LABELS[status])}
    </span>
  );
}
