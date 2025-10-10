"use client";

import { EmployeeDetailsOrdersTable } from "./employee-details-order-table";
import { EmployeeStatistic2 } from "./employee-statistic-2";

export function EmployeeDetailsOrders() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic2 />
      <EmployeeDetailsOrdersTable />
    </div>
  );
}
