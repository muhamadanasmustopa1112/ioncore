"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { notFound } from "next/navigation";
import { RiLoader2Line } from "@remixicon/react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useOltById } from "@/features/noc/odp-pop/api/get-olt";
import { useOdp } from "@/features/noc/odp-pop/api/get-odp";
import { OltData } from "../../types/olt";
import { OltDetailHeader } from "./components/olt-detail-header";
import { OltDetailKpi } from "./components/olt-detail-kpi";
import { OltOdpListTable } from "./components/olt-odp-list-table";
import dynamic from "next/dynamic";

const OltOdpMap = dynamic(() => import("../map/olt-odp-map"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading Map...</div>,
});

export function OltDetailContent({ oltId }: { oltId: string }) {
  const { t } = useTranslation();
  const { data: oltResponse, isLoading } = useOltById({
    id: oltId
  });

  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });

  const { data: odpResponse, isLoading: isLoadingOdp } = useOdp({
    params: {
      olt_id: oltId,
      limit: filter.limit || 10,
      page: filter.page || 1,
      search: filter.search || "",
    }
  });

  const olt = useMemo<OltData | undefined>(() => {
    if (!oltResponse) return undefined;
    const apiData = oltResponse;

    return {
      ...apiData,
      portsUsed: apiData.occupied_port ?? apiData.portsUsed ?? 0,
      totalPorts: apiData.total_port ?? apiData.totalPorts ?? 16,
      odpCount: apiData.odpCount || 0,
      ipAddress: apiData.ipAddress || apiData.ip_address || "0.0.0.0",
      model: apiData.model || "N/A",
      status: (apiData.status?.toLowerCase() as any) || 'active',
    };
  }, [oltResponse]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <RiLoader2Line className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">{t("odpPop.loadingOlt", "Loading OLT data...")}</p>
      </div>
    );
  }

  if (!olt) {
    notFound();
  }

  return (
    <div className="relative h-full w-full flex flex-col gap-y-6 overflow-y-auto px-6 py-4 bg-background custom-scrollbar">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.headings.networkOrchestration"),
            path: paths.dashboard.networkAndOrchestration.root.getHref(),
          },
          {
            title: t("menu.odpPop"),
            path: paths.dashboard.networkAndOrchestration.odpPop.manage.getHref()
          },
          { title: `${t("odpPop.oltDetail", "OLT Detail")} (${olt.name})` },
        ]}
        className="mb-0"
      />
      <div className="flex flex-col gap-8 max-w-7xl">
        <OltDetailHeader olt={olt} />
        <OltDetailKpi olt={olt} />
        <OltOdpMap data={odpResponse} isLoading={isLoadingOdp} />
        <div className="space-y-4">
          <OltOdpListTable
            data={odpResponse}
            isLoading={isLoadingOdp}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>
    </div>
  );
}
