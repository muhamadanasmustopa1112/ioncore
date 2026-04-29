"use client";

import { use, Suspense } from "react";
import { ScreenLoader } from "@/components/common/screen-loader";
import { OltDetailContent } from "@/features/noc/odp-pop/components/olt-detail";

export default function OltDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={<ScreenLoader />}>
      <OltDetailContent oltId={id} />
    </Suspense>
  );
}

