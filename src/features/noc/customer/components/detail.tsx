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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCustomerStore } from "../store/customer";
import { useEffect } from "react";

export function CustomerDetail() {
  const router = useRouter();
  const { setForm } = useCustomerStore();

  useEffect(() => {
    setForm("details");
  }, [setForm]);

  const onBackClick = () => {
    router.back();
  };

  return (
    <>
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
              { title: "Customer Details" },
            ]}
            className="mt-2"
          />
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" onClick={onBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="p-6">
        <Card>
          <CardContent className="p-0">
            <CustomerForm />
          </CardContent>
          <CardFooter className="border-t p-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onBackClick}>
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
