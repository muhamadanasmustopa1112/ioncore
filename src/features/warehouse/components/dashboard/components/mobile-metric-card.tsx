"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MobileMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  delta?: string;
  deltaType?: "up" | "down";
}

export function MobileMetricCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-700 dark:text-blue-400",
  delta,
  deltaType = "up",
}: MobileMetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-100 dark:border-slate-800">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5 min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {title}
            </p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {value}
            </h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg shrink-0">
            <Icon className={`size-4 ${iconColor}`} />
          </div>
        </div>
        {delta && (
          <div className="flex items-center gap-1 mt-2 text-[9px] font-medium text-slate-400">
            <span
              className={`flex items-center font-bold gap-0.5 ${
                deltaType === "up" ? "text-green-600" : "text-red-500"
              }`}
            >
              {delta}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
