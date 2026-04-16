"use client";

import { RiRouterLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { PopOltDetail } from "../../data/dummy-olt-details";

export function OltDetailHeader({ olt }: { olt: PopOltDetail }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-3xl shadow-sm border border-border/40">
      <div className="flex items-start gap-5">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <RiRouterLine className="size-10 text-primary" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              {olt.name}
            </h1>
            <Badge
              variant={olt.status === 'active' ? 'success' : 'warning'}
              appearance="light"
              className="px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            >
              {olt.status === 'active' ? 'Online' : 'Warning'}
            </Badge>
          </div>
          <p className="text-muted-foreground font-bold tracking-tight uppercase text-sm">
            {olt.model} • {olt.ipAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
