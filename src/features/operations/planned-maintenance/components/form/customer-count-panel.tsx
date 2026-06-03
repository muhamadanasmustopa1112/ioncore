"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DUMMY_CUSTOMER_COUNTS } from "../../data/dummy-areas";
import type { MaintenanceAffectedArea } from "../../types";

type CustomerCountPanelProps = {
  affectedAreas: MaintenanceAffectedArea[];
};

type CustomerTypeCount = {
  broadband: number;
  business: number;
  enterprise: number;
  total: number;
};

export function CustomerCountPanel({ affectedAreas }: CustomerCountPanelProps) {
  const counts = useMemo((): CustomerTypeCount => {
    const subAreaIds = affectedAreas.flatMap((a) => a.sub_area_ids);
    const result = { broadband: 0, business: 0, enterprise: 0, total: 0 };
    for (const sub of DUMMY_CUSTOMER_COUNTS) {
      if (subAreaIds.includes(sub.sub_area_id)) {
        result.broadband += sub.broadband;
        result.business += sub.business;
        result.enterprise += sub.enterprise;
      }
    }
    result.total = result.broadband + result.business + result.enterprise;
    return result;
  }, [affectedAreas]);

  if (affectedAreas.length === 0) return null;

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Estimated Customers Affected</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{counts.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{counts.broadband}</p>
            <p className="text-xs text-muted-foreground">Broadband</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{counts.business}</p>
            <p className="text-xs text-muted-foreground">Business</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{counts.enterprise}</p>
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
