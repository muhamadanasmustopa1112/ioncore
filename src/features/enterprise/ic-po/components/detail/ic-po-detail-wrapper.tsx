"use client";

import { use } from "react";
import { IcPoDetailPage } from "./ic-po-detail";

export function IcPoDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <IcPoDetailPage icPoId={id} />;
}
