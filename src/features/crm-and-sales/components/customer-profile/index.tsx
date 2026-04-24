"use client";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCustomer } from "@/features/customers/api/customers-queries";
import { CustomerHeader } from "./customer-header";
import { ServiceOverview } from "./service-overview";
import { PaymentHistoryTable } from "./payment-history-table";
import { CustomerWidgets } from "./customer-widgets";

export function CustomerProfile() {
  const params = useParams<{ customerId: string }>();
  const id = params?.customerId ?? "";
  const { data: customer, isLoading } = useCustomer(id);

  return (
    <div className="flex flex-col gap-8 p-4">
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
            <BreadcrumbPage>
              {customer?.full_name ?? (isLoading ? "Loading…" : "Customer")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CustomerHeader customer={customer ?? undefined} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          <ServiceOverview />
          <PaymentHistoryTable />
        </div>
        <div className="flex flex-col gap-6">
          <CustomerWidgets />
        </div>
      </div>
    </div>
  );
}
