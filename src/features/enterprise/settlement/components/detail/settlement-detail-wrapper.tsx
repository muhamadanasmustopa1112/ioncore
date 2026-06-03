"use client";

import { use } from "react";
import { SettlementDetailPage } from "./settlement-detail";

export function SettlementDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SettlementDetailPage settlementId={id} />;
}
