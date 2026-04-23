"use client";

import dynamic from "next/dynamic";
import { PopOltDetail } from "../../../data/dummy-olt-details";
import { OltDetailHeader } from "./olt-detail-header";
import { OltDetailKpi } from "./olt-detail-kpi";
import { OltOdpListTable } from "./olt-odp-list-table";

const OltOdpMap = dynamic(() => import("../../map/olt-odp-map"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-3xl" />,
});

export function OltDetailContent({ olt }: { olt: PopOltDetail }) {
  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <OltDetailHeader olt={olt} />
      <OltDetailKpi olt={olt} />
      <OltOdpMap oltId={olt.id} />
      <div className="space-y-4">
        <OltOdpListTable oltId={olt.id} />
      </div>
    </div>
  );
}
