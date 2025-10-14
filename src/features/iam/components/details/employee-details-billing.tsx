"use client";

import { EmployeeBillingDetail } from "./employee-billing-detail";
import { EmployeePaymentMethods } from "./employee-payment-methods";
import { EmployeeStatistic3 } from "./employee-statistic-3";

export function EmployeeDetailsBilling() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic3 />
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <EmployeeBillingDetail />
        <EmployeePaymentMethods />
      </div>
    </div>
  );
}
