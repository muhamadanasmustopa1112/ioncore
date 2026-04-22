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

import { RiCheckLine } from "@remixicon/react";
import { useUpdatePPPCustomer } from "../api/put-ppp-customer";
import { CreatePPPCustomerRequest } from "../types";

export function CustomerUpdate({ id }: { id: string }) {
  const router = useRouter();
  const { setForm, setSelectedId, formData } = useCustomerStore();

  const updateMutation = useUpdatePPPCustomer({
    mutationConfig: {
      onSuccess: () => {
        router.push(paths.dashboard.networkAndOrchestration.customer.root.getHref());
      }
    }
  });

  useEffect(() => {
    setForm("edit");
    setSelectedId(id);
  }, [setForm, setSelectedId, id]);

  const onBackClick = () => {
    router.back();
  };

  const handleSubmit = () => {
    const payload: CreatePPPCustomerRequest = {
      address: formData.address || "",
      auth_status: formData.auth_status || "Enabled-Users",
      bandwidth: formData.bandwidth || "",
      bind_mac: formData.bind_mac || "NO",
      created_at: formData.created_at || "",
      email: formData.email || "",
      expired_on: formData.expired_on || "",
      fullname: formData.fullname || "",
      mac_address: formData.mac_address || "",
      member_id: formData.member_id || "",
      method: formData.method || "pppoe",
      nasporttype: formData.nasporttype || "Ethernet",
      note: formData.note || "",
      owner_name: formData.owner_name || "radius_admin",
      password: formData.password || "",
      payment_type: formData.payment_type || "POSTPAID",
      phonenumber: formData.phonenumber || "",
      plan_name: formData.plan_name || "",
      remote_address: formData.remote_address || "Automatic",
      renewed_on: formData.renewed_on || new Date().toISOString().slice(0, 19).replace('T', ' '),
      server_name: formData.server_name || "",
      servicetype: formData.servicetype || "Framed-User",
      total: formData.total || "0",
      trx_invoice: formData.trx_invoice || `INV-PPP-${Date.now()}`,
      trx_status: formData.trx_status || "UNPAID",
      username: formData.username || "",
    };

    updateMutation.mutate({ id, data: payload });
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
              { title: "Edit Customer" },
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
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              className="gap-2 font-bold bg-primary text-white shadow-lg shadow-primary/20"
            >
              {updateMutation.isPending ? "Saving..." : "Save Change"}
              <RiCheckLine className="size-4" />
            </Button>
          </CardFooter>

        </Card>
      </div>
    </>
  );
}
