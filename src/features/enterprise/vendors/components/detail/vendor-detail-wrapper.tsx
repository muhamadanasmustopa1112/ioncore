"use client";

import { use } from "react";
import { VendorDetailPage } from "./vendor-detail";

export function VendorDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <VendorDetailPage vendorId={id} />;
}
