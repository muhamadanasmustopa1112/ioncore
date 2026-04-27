"use client";

import dynamic from "next/dynamic";

const OdpPopMapClient = dynamic(
  () => import("./odp-pop-map"),
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground font-medium text-lg">Initializing geographic data...</div>
  }
);

export function OdpPopMapWrapper({
  selectedPopId,
  showOdps = true,
  data,
  isLoading
}: {
  selectedPopId: string | null;
  showOdps?: boolean;
  data?: any;
  isLoading?: boolean;
}) {
  return (
    <OdpPopMapClient 
      selectedPopId={selectedPopId} 
      showOdps={showOdps} 
      data={data}
      isLoading={isLoading}
    />
  );
}
