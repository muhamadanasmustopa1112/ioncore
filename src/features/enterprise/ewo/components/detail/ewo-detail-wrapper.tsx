"use client";

import { use } from "react";
import { EwoDetailPage } from "./ewo-detail";

export function EwoDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EwoDetailPage ewoId={id} />;
}
