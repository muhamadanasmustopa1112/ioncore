"use client";

import { EmployeeLoyaltyTier } from "../details/employee-loyalty-tier";
import { EmployeeRecentOrder } from "../details/employee-recent-order";
import { EmployeeStatisticTwoColumns } from "./employee-statistic-two-columns";

export function EmployeeDetailsOverviewsTwoColumns() {
  return (
    <div className="space-y-5">
      <EmployeeStatisticTwoColumns />
      <div className="grid items-stretch gap-5">
        <EmployeeRecentOrder />
        <EmployeeLoyaltyTier />
      </div>
    </div>
  );
}
