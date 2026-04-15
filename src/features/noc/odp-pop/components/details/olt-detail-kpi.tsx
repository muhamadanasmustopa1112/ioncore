"use client";

import { RiSignalTowerLine, RiHashtag, RiGlobalLine } from "@remixicon/react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PopOltDetail } from "../../data/dummy-olt-details";

export function OltDetailKpi({ olt }: { olt: PopOltDetail }) {
  const capacityPercentage = (olt.portsUsed / olt.totalPorts) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <RiSignalTowerLine className="size-6" />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            Port Capacity
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-foreground">
              {olt.portsUsed} <span className="text-lg text-muted-foreground ml-1">/ {olt.totalPorts}</span>
            </h3>
            <span className={`text-sm font-black ${
              capacityPercentage > 90 ? 'text-destructive' : 
              capacityPercentage > 70 ? 'text-orange-500' : 'text-primary'
            }`}>
              {Math.round(capacityPercentage)}%
            </span>
          </div>
          <Progress 
            value={capacityPercentage} 
            className="h-2"
            indicatorClassName={
              capacityPercentage > 90 ? 'bg-destructive' : 
              capacityPercentage > 70 ? 'bg-orange-500' : 'bg-primary'
            }
          />
        </div>
      </Card>

      <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
            <RiHashtag className="size-6" />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            ODP Connected
          </span>
        </div>
        <h3 className="text-3xl font-black text-foreground">
          {olt.odpCount} <span className="text-lg text-muted-foreground ml-1 uppercase">Units</span>
        </h3>
      </Card>

      <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
            <RiGlobalLine className="size-6" />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            IP Address
          </span>
        </div>
        <h3 className="text-3xl font-black text-foreground font-mono">
          {olt.ipAddress}
        </h3>
      </Card>
    </div>
  );
}
