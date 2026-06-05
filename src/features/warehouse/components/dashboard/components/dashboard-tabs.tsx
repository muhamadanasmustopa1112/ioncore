"use client";

import { Package, Cpu, Wrench, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DashboardTab } from "../types";

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isMobile: boolean;
}

const TABS: { value: DashboardTab; icon: React.ElementType; mobileLabel: string; desktopLabel: string }[] = [
  { value: "inventory", icon: Package, mobileLabel: "Inventory", desktopLabel: "Inventory Stock & Alerts" },
  { value: "assets", icon: Cpu, mobileLabel: "Assets", desktopLabel: "Serialized Assets (Lifecycle)" },
  { value: "retrofits", icon: Wrench, mobileLabel: "Retrofits", desktopLabel: "Asset Retrofits (Cannibalization)" },
  { value: "collections", icon: ClipboardList, mobileLabel: "Collections", desktopLabel: "Goods Collection (Technician Pick-up)" },
];

export function DashboardTabs({ activeTab, onTabChange, isMobile }: DashboardTabsProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-slate-200 dark:border-slate-800 z-50 safe-area-pb">
        <nav className="flex items-center justify-around h-14">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  isActive
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === tab.value
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {tab.desktopLabel}
        </button>
      ))}
    </div>
  );
}
