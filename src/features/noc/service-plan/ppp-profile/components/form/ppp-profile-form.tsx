"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePPPProfileStore } from "../../store/ppp-profile";
import { pppProfileSchema, PPPProfileFormData, useCreatePPPProfile } from "../../api/post-ppp-profile";
import { CreatePPPProfileRequest } from "../../types/ppp-profile";
import { useUpdatePPPProfile } from "../../api/put-ppp-profile";
import { GeneralInformationSection } from "./sections/general-information-section";
import { PricingCapacitySection } from "./sections/pricing-capacity-section";
import { PlanConfigurationSection } from "./sections/plan-configuration-section";

interface PPPProfileFormProps {
  mode: "new" | "edit" | "details";
  pppProfileCode?: string;
}

export type PPPProfileFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const PPPProfileForm = forwardRef<PPPProfileFormRef, PPPProfileFormProps>(
  ({ mode, pppProfileCode }, ref) => {
    const isNewMode = mode === "new";
    const isDetailMode = mode === "details";
    const { closePPPProfileFormSheet, selectedPPPProfile } = usePPPProfileStore();

    const { mutate: createPPPProfile, isPending: isCreating } = useCreatePPPProfile({
      mutationConfig: {
        onSuccess: () => closePPPProfileFormSheet(),
      },
    });

    const { mutate: updatePPPProfile, isPending: isUpdating } = useUpdatePPPProfile({
      mutationConfig: {
        onSuccess: () => closePPPProfileFormSheet(),
      },
    });

    const isPending = isCreating || isUpdating;

    const profile = selectedPPPProfile;

    const form = useForm<PPPProfileFormData>({
      resolver: zodResolver(pppProfileSchema) as any,
      values: (profile && mode !== "new") ? {
        name: profile.name || "",
        code: profile.code || "",
        data_owner: profile.data_owner || "radius_admin",
        plan_validity: profile.plan_validity || "30 Days",
        shared_users: profile.shared_users || "1",
        service_type: profile.service_type || "PPP",
        privileges: profile.privileges || "GLOBAL",
        vat: profile.vat || "11%",
        profile_group: profile.profile_group || "",
        promo: profile.promo || "-",
        capital_price: profile.capital_price?.toString() || "0",
        sell_price: profile.sell_price?.toString() || "0",
        customer_count: profile.customer_count?.toString() || "100",
        voucher_count: profile.voucher_count?.toString() || "100",
        attributes: {
          realm: profile.attributes?.realm || "pppoe",
        },
      } : {
        name: "",
        code: "",
        data_owner: "radius_admin",
        plan_validity: "30 Days",
        shared_users: "1",
        service_type: "PPP",
        privileges: "GLOBAL",
        vat: "11%",
        profile_group: "",
        promo: "-",
        capital_price: "0",
        sell_price: "0",
        customer_count: "0",
        voucher_count: "0",
        attributes: {
          realm: "pppoe",
        },
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit)();
      },
      isPending,
    }));

    const onSubmit = (data: PPPProfileFormData) => {
      const payload: CreatePPPProfileRequest = {
        ...data,
        capital_price: parseInt(data.capital_price),
        sell_price: parseInt(data.sell_price),
        customer_count: parseInt(data.customer_count),
        voucher_count: parseInt(data.voucher_count),
      };

      if (mode === "edit" && pppProfileCode) {
        updatePPPProfile({ code: pppProfileCode, data: payload });
      } else {
        createPPPProfile(payload);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-10 pb-10">
                  <GeneralInformationSection isDetailMode={isDetailMode} isPending={isPending} isNewMode={isNewMode} />
                  <PricingCapacitySection isDetailMode={isDetailMode} isPending={isPending} />
                  <PlanConfigurationSection isDetailMode={isDetailMode} isPending={isPending} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  }
);

PPPProfileForm.displayName = "PPPProfileForm";
