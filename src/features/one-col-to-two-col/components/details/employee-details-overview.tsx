"use client";

import { EmployeeLoyaltyTier } from "./employee-loyalty-tier";
import { EmployeeRecentOrder } from "./employee-recent-order";
import { EmployeeStatistic } from "./employee-statistic";

export function EmployeeDetailsOverviews() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic />
      <div className="grid lg:grid-cols-2 gap-5 items-stretch">
        <EmployeeRecentOrder />
        <EmployeeLoyaltyTier />
      </div>
    </div>
  );
}
