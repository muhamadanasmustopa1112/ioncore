"use client";

import { Warehouse, Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddAsset: () => void;
}

export function DashboardHeader({ searchQuery, onSearchChange, onAddAsset }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.dashboard", "Dashboard") },
          { title: t("warehouse.title", "Warehouse") },
        ]}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl">
            <Warehouse className="size-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t("warehouse.title", "Warehouse Dashboard")}
            </h1>
            <p className="text-xs text-slate-400">
              {t("warehouse.subtitle", "Inventory, assets, and lifecycle management")}
            </p>
          </div>
        </div>
        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder={t("warehouse.searchPlaceholder", "Search inventory, assets...")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={onAddAsset}>
            <Plus className="size-4" />
            {t("warehouse.addAsset", "Add Asset")}
          </Button>
        </div>
      </div>
    </div>
  );
}
