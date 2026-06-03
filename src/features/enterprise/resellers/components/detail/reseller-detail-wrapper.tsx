"use client";

import { use } from "react";
import { ResellerDetailPage } from "./reseller-detail";

export function ResellerDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResellerDetailPage resellerId={id} />;
}
