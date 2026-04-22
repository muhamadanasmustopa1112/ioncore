"use client";

import dynamic from "next/dynamic";

const OdpPopMapClient = dynamic(
  () => import("./odp-pop-map"),
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground font-medium text-lg">Initializing geographic data...</div>
  }
);

export function OdpPopMapWrapper({ selectedPopId }: { selectedPopId: string | null }) {
  return <OdpPopMapClient selectedPopId={selectedPopId} />;
}
