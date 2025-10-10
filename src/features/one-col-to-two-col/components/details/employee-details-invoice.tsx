"use client";

import { EmployeeDetailsInvoiceTable } from "./employee-details-invoice-table";
import { EmployeeStatistic4 } from "./employee-statistic-4";

export function EmployeeDetailsInvoice() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic4 />
      <EmployeeDetailsInvoiceTable />
    </div>
  );
}
