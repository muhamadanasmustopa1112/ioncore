"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomerHeader } from "./customer-header";
import { ServiceOverview } from "./service-overview";
import { PaymentHistoryTable } from "./payment-history-table";
import { CustomerWidgets } from "./customer-widgets";
export function CustomerProfile() {
  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm-and-sales">CRM &amp; Sales</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Customer Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Customer Header */}
      <CustomerHeader />
      {/* 2-column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <ServiceOverview />
          <PaymentHistoryTable />
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <CustomerWidgets />
        </div>
      </div>
    </div>
  );
}