"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useOlt } from "@/features/noc/odp-pop/api/get-olt";
import { OltDetailContent } from "@/features/noc/odp-pop/components/details/components/olt-detail-content";
import { RiLoader2Line } from "@remixicon/react";
import { PopOltDetail } from "@/features/noc/odp-pop/data/dummy-olt-details";

export default function OltDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: oltResponse, isLoading } = useOlt({
    params: { id }
  });

  const olt = useMemo<PopOltDetail | undefined>(() => {
    if (!oltResponse?.data?.[0]) return undefined;
    const apiData = oltResponse.data[0];
    
    // Mapping API data to UI format (PopOltDetail)
    return {
      ...apiData,
      portsUsed: apiData.portsUsed || 0,
      totalPorts: apiData.totalPorts || 16,
      odpCount: apiData.odpCount || 0,
      ipAddress: apiData.ipAddress || apiData.ip_address || "0.0.0.0",
      model: apiData.model || "N/A",
      status: (apiData.status?.toLowerCase() as any) || 'active',
    };
  }, [oltResponse]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RiLoader2Line className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading OLT data...</p>
      </div>
    );
  }

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

