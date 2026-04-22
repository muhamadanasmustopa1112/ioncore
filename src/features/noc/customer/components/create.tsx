"use client";
 
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { CustomerForm } from "./form/service-form";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerStore } from "../store/customer";
import { useEffect } from "react";
 
export function CustomerCreate() {
  const router = useRouter();
  const { setForm } = useCustomerStore();
 
  useEffect(() => {
    setForm("new");
  }, [setForm]);
 
  const onBackClick = () => {
    router.back();
  };
 
  return (
    <>
      <div className="px-6 pt-4 pb-2">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight">Customer</ToolbarTitle>
            <PageBreadcrumb
              items={[
                {
                  title: "Network & Orchestration",
                  path: paths.dashboard.networkAndOrchestration.root.getHref(),
                },
                { title: "ION Radius" },
                {
                  title: "Customer",
                  path: paths.dashboard.networkAndOrchestration.customer.root.getHref(),
                },
                { title: "Add New Customer" },
              ]}
              className="mt-1"
            />
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" onClick={onBackClick} size="sm" className="h-9">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
 
      <div className="px-6 py-2">
        <Card>
          <CardContent className="p-0">
            <CustomerForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
