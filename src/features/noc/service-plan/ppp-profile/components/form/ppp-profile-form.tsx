"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiSettings4Line,
  RiDatabase2Line,
  RiShieldLine,
  RiGroupLine,
} from "@remixicon/react";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePPPProfileStore } from "../../store/ppp-profile";
import { pppProfileSchema, PPPProfileFormData, useCreatePPPProfile } from "../../api/post-ppp-profile";
import { CreatePPPProfileRequest } from "../../types/ppp-profile";
import { useGetPPPProfile } from "../../api/get-ppp-profile";
import { useUpdatePPPProfile } from "../../api/put-ppp-profile";

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
    const { closePPPProfileFormSheet } = usePPPProfileStore();

    const { data: pppProfileData, isLoading: isLoadingProfile } = useGetPPPProfile({
      id: pppProfileCode || "",
      queryConfig: {
        enabled: !!pppProfileCode && mode !== "new",
      },
    });

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

    const profile = pppProfileData?.data;

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

    if (isLoadingProfile) {
      return (
        <Card className="mt-[10px] mx-6">
          <CardContent className="py-6">
            <div className="text-center text-muted-foreground animate-pulse">
              Loading PPP Profile data...
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-10 pb-10">

                  {/* General Information */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <RiInformationLine className="size-4 text-blue-500" />
                      <h3 className="text-sm font-semibold">General Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Profile Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" placeholder="e.g. PPP Basic" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Profile Code</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || !isNewMode || isPending} className="h-10 uppercase" placeholder="e.g. PPP-BASIC" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="data_owner"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Data Owner</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                <RiDatabase2Line className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="attributes.realm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Realm</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Pricing & Capacity */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <RiMoneyDollarCircleLine className="size-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold">Pricing & Capacity</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name="capital_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Capital Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rp</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sell_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Sell Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rp</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customer_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Customer Count</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="voucher_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Voucher Count</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Plan Configuration */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <RiSettings4Line className="size-4 text-orange-500" />
                      <h3 className="text-sm font-semibold">Plan Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name="profile_group"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Profile Group</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                <RiGroupLine className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="plan_validity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Plan Validity</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" placeholder="e.g. 30 Days" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shared_users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Shared Users</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Service Type</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="privileges"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Privileges</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                <RiShieldLine className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">VAT</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10 pr-8 text-right" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="promo"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel className="text-xs text-muted-foreground">Promo</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

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
