"use client";

import { EmployeeLoyaltyTier } from "./employee-loyalty-tier";
import { EmployeeRecentOrder } from "./employee-recent-order";
import { EmployeeStatistic } from "./employee-statistic";

export function EmployeeDetailsOverviews() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic />
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <EmployeeRecentOrder />
        <EmployeeLoyaltyTier />
      </div>
    </div>
  );
}
