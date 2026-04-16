"use client";

import { use, useMemo } from "react";
import { DUMMY_POP_DATA } from "@/features/noc/odp-pop/data/dummy-odp-pop";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { PopDetailHeader } from "@/features/noc/odp-pop/components/details/pop-detail-header";
import { PopDetailKpi } from "@/features/noc/odp-pop/components/details/pop-detail-kpi";
import { notFound } from "next/navigation";
import { PopOltInventoryTable } from "@/features/noc/odp-pop/components/details/pop-olt-inventory-table";
import { PopDeviceInventoryTable } from "@/features/noc/odp-pop/components/details/pop-device-inventory-table";

export default function PopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const pop = useMemo(() =>
    DUMMY_POP_DATA.find(p => p.id === id)
    , [id]);

  if (!pop) {
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
          { title: `POP Detail (${pop.name})` },
        ]}
        className="mb-0"
      />

      <div className="flex flex-col gap-8 max-w-7xl">
        <PopDetailHeader pop={pop} />

        <div className="space-y-8">
          <PopDetailKpi pop={pop} />
          <PopOltInventoryTable popId={pop.id} />
          <PopDeviceInventoryTable popId={pop.id} />
        </div>
      </div>
    </div>
  );
}
