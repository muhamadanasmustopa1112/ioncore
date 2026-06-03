"use client";

import { use, useEffect } from "react";
import { VendorListPage } from "../index";
import { useVendorStore } from "../../store/vendor";
import { useVendor } from "../../api/get-vendor";

export function VendorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: vendor } = useVendor(id);
  const { openFormSheet, setSelectedItem } = useVendorStore();

  useEffect(() => {
    if (vendor) {
      setSelectedItem(vendor);
      openFormSheet("edit");
    }
  }, [vendor, openFormSheet, setSelectedItem]);

  return <VendorListPage />;
}
