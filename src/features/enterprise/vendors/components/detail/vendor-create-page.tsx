"use client";

import { useEffect } from "react";
import { VendorListPage } from "../index";
import { useVendorStore } from "../../store/vendor";

export function VendorCreatePage() {
  const { openFormSheet } = useVendorStore();

  useEffect(() => {
    openFormSheet("new");
  }, [openFormSheet]);

  return <VendorListPage />;
}
