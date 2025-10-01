"use client";

import { EmployeeBillingDetail } from "./employee-billing-detail";
import { EmployeePaymentMethods } from "./employee-payment-methods";
import { EmployeeStatistic3 } from "./employee-statistic-3";

export function EmployeeDetailsBilling() {
  return (
    <div className="space-y-5">
      <EmployeeStatistic3 />
      <div className="grid lg:grid-cols-2 gap-5 items-stretch">
        <EmployeeBillingDetail />
        <EmployeePaymentMethods />
      </div>
    </div>
  );
}
