"use client";

import { useEffect } from "react";
import { ResellerListPage } from "../index";
import { useResellerStore } from "../../store/reseller";

export function ResellerCreatePage() {
  const { openFormSheet } = useResellerStore();

  useEffect(() => {
    openFormSheet("new");
  }, [openFormSheet]);

  return <ResellerListPage />;
}
