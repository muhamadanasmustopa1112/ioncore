"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_OLT_DETAILS } from "@/features/noc/odp-pop/data/dummy-olt-details";
import { OltDetailContent } from "@/features/noc/odp-pop/components/details/components/olt-detail-content";

export default function OltDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const olt = useMemo(() =>
    Object.values(DUMMY_OLT_DETAILS).flat().find(o => o.id === id)
    , [id]);

  if (!olt) {
    notFound();
  }

  return (
    <div className="relative h-full w-full flex flex-col gap-y-6 overflow-y-auto px-6 py-4 bg-background">
      <PageBreadcrumb
        items={[
          {
            title: "Network & Orchestration",
            path: paths.dashboard.networkAndOrchestration.root.getHref(),
          },
          {
            title: "ODP & POP",
            path: paths.dashboard.networkAndOrchestration.odpPop.manage.getHref()
          },
          { title: `OLT Detail (${olt.name})` },
        ]}
        className="mb-0"
      />
      <OltDetailContent olt={olt} />
    </div>
  );
}

