"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { AuditList } from "./list/audit-list";
import { AuditDetailSheet } from "./detail/audit-detail-sheet";
import type { AuditLog, AuditLogFilters } from "../types/audit-log";

export function AuditLogPage() {
  const { t } = useTranslation();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [filters] = useState<Partial<AuditLogFilters>>({
    page: 1,
    perPage: 20,
  });

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: t("administration.auditLogPage.breadcrumbAdmin"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.auditLogPage.breadcrumbTitle") },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("administration.auditLogPage.title")}
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="secondary"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <ScrollText className="size-3.5" />
              {t("administration.auditLogPage.badge")}
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              {t("administration.auditLogPage.desc")}
            </span>
          </div>
        </ToolbarHeading>
      </Toolbar>

      <div className="flex-1 overflow-auto mt-4">
        <AuditList filters={filters} onViewDetail={handleViewDetail} />
      </div>

      <AuditDetailSheet
        log={selectedLog}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
