"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useMaintenanceStore } from "../../store/maintenance";
import { maintenanceSchema, type MaintenanceFormData } from "../../types";

type MaintenanceFormProps = {
  mode: "new" | "edit" | "details";
  onSuccess?: () => void;
  maintenanceId?: string;
  readOnly?: boolean;
};

export type MaintenanceFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const MaintenanceForm = forwardRef<MaintenanceFormRef, MaintenanceFormProps>(
  ({ onSuccess, readOnly = false, mode }, ref) => {
    const { closeFormSheet, selectedMaintenance } = useMaintenanceStore();

    const data = selectedMaintenance;
    const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";

    const form = useForm<MaintenanceFormData>({
      resolver: zodResolver(maintenanceSchema),
      values: data && mode !== "new" ? {
        title: data.title || "",
        description: data.description || "",
        maintenance_type: data.maintenance_type || "other",
        scheduled_start: data.scheduled_start?.slice(0, 16) || "",
        scheduled_end: data.scheduled_end?.slice(0, 16) || "",
        service_impact: data.service_impact || "no_impact",
        requires_service_suspension: data.requires_service_suspension ?? false,
        outcome_notes: data.outcome_notes || "",
      } : {
        title: "",
        description: "",
        maintenance_type: "other",
        scheduled_start: "",
        scheduled_end: "",
        service_impact: "no_impact",
        requires_service_suspension: false,
        outcome_notes: "",
      },
    });

    const isPending = false;

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit)();
      },
      isPending,
    }));

    const onSubmit = (formData: MaintenanceFormData) => {
      void formData;
      closeFormSheet();
      onSuccess?.();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <div className={cn("flex h-full grow flex-wrap px-3.5", { "lg:flex-nowrap": !isVerticalSidebar })}>
                <div className={cn("grow py-5", { "border-border lg:border-s": !isVerticalSidebar })}>
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-8 pb-6">
                      {/* General Information */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter maintenance title" {...field} disabled={readOnly || isPending} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maintenance_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maintenance Type</FormLabel>
                              <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="fiber_upgrade">Fiber Upgrade</SelectItem>
                                  <SelectItem value="olt_maintenance">OLT Maintenance</SelectItem>
                                  <SelectItem value="odp_replacement">ODP Replacement</SelectItem>
                                  <SelectItem value="backbone">Backbone</SelectItem>
                                  <SelectItem value="config_change">Config Change</SelectItem>
                                  <SelectItem value="power">Power</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <FormField
                            control={form.control}
                            name="scheduled_start"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scheduled Start</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} disabled={readOnly || isPending} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="scheduled_end"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scheduled End</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} disabled={readOnly || isPending} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="service_impact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Impact</FormLabel>
                              <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select impact level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full_outage">Full Outage</SelectItem>
                                  <SelectItem value="degraded">Degraded</SelectItem>
                                  <SelectItem value="no_impact">No Impact</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="requires_service_suspension"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={readOnly || isPending}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Requires Service Suspension</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="outcome_notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Outcome Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter outcome notes..."
                                  className="min-h-[100px] resize-none"
                                  {...field}
                                  disabled={readOnly || isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  },
);

MaintenanceForm.displayName = "MaintenanceForm";
