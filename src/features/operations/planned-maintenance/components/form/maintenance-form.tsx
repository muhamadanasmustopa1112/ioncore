"use client";

import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { maintenanceFormSchema, type MaintenanceFormData, type MaintenanceStatus } from "../../types";
import { useCreateMaintenance } from "../../api/post-maintenance";
import { useUpdateMaintenanceStatus } from "../../api/put-maintenance-status";
import { MaintenanceFormActions } from "./maintenance-form-actions";
import { AreaPicker } from "./area-picker";
import { NodeSelector } from "./node-selector";
import { CustomerCountPanel } from "./customer-count-panel";
import { MaintenanceTimeline } from "./maintenance-timeline";

const STATUS_VARIANT: Record<MaintenanceStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  draft: "secondary", scheduled: "primary", approved: "primary",
  in_progress: "warning", completed: "success", cancelled: "destructive", escalated_to_war_room: "destructive",
};

type MaintenanceFormProps = {
  mode: "new" | "edit" | "details" | "approval";
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
    const { closeFormSheet, selectedMaintenance, formAreas, formNodes, setFormAreas, setFormNodes } = useMaintenanceStore();
    const { mutate: createMaintenance, isPending: isCreating } = useCreateMaintenance();
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateMaintenanceStatus();
    const data = selectedMaintenance;
    const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";
    const isApprovalMode = mode === "approval";
    const isDetailMode = mode === "details";
    const isReadOnly = readOnly || isDetailMode;

    useEffect(() => {
      if (data && mode !== "new") {
        setFormAreas(data.affected_areas || []);
        setFormNodes(data.impacted_nodes || []);
      } else if (mode === "new") {
        setFormAreas([]);
        setFormNodes([]);
      }
    }, [data, mode, setFormAreas, setFormNodes]);

    if (isApprovalMode) return <MaintenanceFormActions />;

    const form = useForm<MaintenanceFormData>({
      resolver: zodResolver(maintenanceFormSchema),
      values: data && mode !== "new" ? {
        title: data.title || "",
        description: data.description || "",
        maintenance_type: data.maintenance_type || "other",
        scheduled_start: data.scheduled_start?.slice(0, 16) || "",
        scheduled_end: data.scheduled_end?.slice(0, 16) || "",
        service_impact: data.service_impact || "no_impact",
        requires_service_suspension: data.requires_service_suspension ?? false,
      } : {
        title: "", description: "", maintenance_type: "other",
        scheduled_start: "", scheduled_end: "", service_impact: "no_impact", requires_service_suspension: false,
      },
    });

    const isPending = isUpdatingStatus || isCreating;

    useImperativeHandle(ref, () => ({
      submit: () => { form.handleSubmit(onSubmit)(); },
      isPending,
    }));

    const onSubmit = (formData: MaintenanceFormData) => {
      createMaintenance(formData, {
        onSuccess: () => {
          closeFormSheet();
          onSuccess?.();
        },
      });
    };

    const handleStatus = (status: MaintenanceStatus) => {
      if (!data) return;
      updateStatus({ id: data.id, status }, { onSuccess: () => { closeFormSheet(); onSuccess?.(); } });
    };

    const status = data?.status;

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <div className={cn("flex h-full grow flex-wrap px-3.5", { "lg:flex-nowrap": !isVerticalSidebar })}>
                <div className={cn("grow py-5", { "border-border lg:border-s": !isVerticalSidebar })}>
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-8 pb-6">
                      <div className="space-y-4">
                        {isDetailMode && data && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={STATUS_VARIANT[status ?? "draft"]}>{(status ?? "draft").replace(/_/g, " ")}</Badge>
                          </div>
                        )}

                        <FormField control={form.control} name="title" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter maintenance title" {...field} disabled={isReadOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="description" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe the maintenance event..." className="min-h-[80px] resize-none" {...field} disabled={isReadOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="maintenance_type" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Type</FormLabel>
                            <Select disabled={isReadOnly || isPending} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <FormField control={form.control} name="scheduled_start" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Start</FormLabel>
                              <FormControl><Input type="datetime-local" {...field} disabled={isReadOnly || isPending} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="scheduled_end" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled End</FormLabel>
                              <FormControl><Input type="datetime-local" {...field} disabled={isReadOnly || isPending} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="service_impact" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Impact</FormLabel>
                            <Select disabled={isReadOnly || isPending} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select impact level" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full_outage">Full Outage</SelectItem>
                                <SelectItem value="degraded">Degraded</SelectItem>
                                <SelectItem value="no_impact">No Impact</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="requires_service_suspension" render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly || isPending} />
                            </FormControl>
                            <FormLabel className="font-normal">Requires Service Suspension</FormLabel>
                          </FormItem>
                        )} />
                      </div>

                      <div className="space-y-4 border-t pt-6">
                        <div>
                          <p className="text-sm font-medium">Affected Areas</p>
                          <p className="text-xs text-muted-foreground">Select areas and sub-areas that will be impacted by this maintenance.</p>
                        </div>
                        <AreaPicker value={formAreas} onChange={setFormAreas} disabled={isReadOnly} />
                        <CustomerCountPanel affectedAreas={formAreas} />
                      </div>

                      <div className="space-y-4 border-t pt-6">
                        <div>
                          <p className="text-sm font-medium">Impacted Network Nodes</p>
                          <p className="text-xs text-muted-foreground">Select the PRIMARY node being worked on. Downstream nodes (ODPs, splitters) will be suggested automatically.</p>
                        </div>
                        <NodeSelector value={formNodes} onChange={setFormNodes} disabled={isReadOnly} />
                      </div>

                      {isDetailMode && data && data.outcome_notes && (
                        <div className="space-y-2 border-t pt-6">
                          <p className="text-sm font-medium">Outcome Notes</p>
                          <p className="text-sm">{data.outcome_notes}</p>
                        </div>
                      )}

                      {isDetailMode && data && data.timeline && data.timeline.length > 0 && (
                        <div className="space-y-3 border-t pt-6">
                          <p className="text-sm font-medium">Timeline</p>
                          <MaintenanceTimeline timeline={data.timeline} />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

          {isDetailMode && data && (
            <div className="flex gap-3 border-t p-5">
              {status === "draft" && (
                <Button type="button" variant="primary" onClick={() => handleStatus("scheduled")} disabled={isPending} className="font-semibold">Approve</Button>
              )}
              {status === "scheduled" && (
                <Button type="button" variant="primary" onClick={() => handleStatus("in_progress")} disabled={isPending} className="font-semibold">Start Maintenance</Button>
              )}
              {status === "in_progress" && (
                <>
                  <Button type="button" variant="primary" onClick={() => handleStatus("completed")} disabled={isPending} className="font-semibold">Complete</Button>
                  <Button type="button" variant="destructive" onClick={() => handleStatus("escalated_to_war_room")} disabled={isPending} className="font-semibold">Escalate to War Room</Button>
                </>
              )}
            </div>
          )}
        </form>
      </Form>
    );
  },
);

MaintenanceForm.displayName = "MaintenanceForm";
