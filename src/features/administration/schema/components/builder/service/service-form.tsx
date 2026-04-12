"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiInformationLine,
  RiShieldCheckLine,
  RiSettings3Line,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { serviceFormSchema, type ServiceFormValues } from "../../../types/service-schema";
import { useSchemaStore } from "../../../store/schema";

const DEFAULT_SERVICE: ServiceFormValues = {
  name: "",
  customer_type: "residential",
  sla_uptime: 99.0,
  sla_response_hours: 8,
  sla_resolution_hours: 24,
  bandwidth_type: "best_effort",
  contention_ratio: "1:8",
  support_tier: "standard",
  maintenance_allowed: true,
  maintenance_schedule: "weekdays_02:00-06:00",
};

export function ServiceForm() {
  const { form } = useSchemaStore();
  const isDetailMode = form === "details";

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: DEFAULT_SERVICE,
  });

  const bandwidthType = watch("bandwidth_type");
  const maintenanceAllowed = watch("maintenance_allowed");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Basic Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Schema Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Residential Service Schema"
                  disabled={isDetailMode}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Customer Type</Label>
                <Select
                  value={watch("customer_type")}
                  onValueChange={(v) =>
                    setValue("customer_type", v as ServiceFormValues["customer_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: SLA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiShieldCheckLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">SLA</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Uptime Guarantee (%)</Label>
                <Input
                  type="number"
                  min={90}
                  max={100}
                  step={0.1}
                  disabled={isDetailMode}
                  {...register("sla_uptime", { valueAsNumber: true })}
                />
                {errors.sla_uptime && (
                  <p className="text-xs text-red-500">{errors.sla_uptime.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Response Time Hours</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={isDetailMode}
                  {...register("sla_response_hours", { valueAsNumber: true })}
                />
                {errors.sla_response_hours && (
                  <p className="text-xs text-red-500">{errors.sla_response_hours.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Resolution Time Hours</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={isDetailMode}
                  {...register("sla_resolution_hours", { valueAsNumber: true })}
                />
                {errors.sla_resolution_hours && (
                  <p className="text-xs text-red-500">{errors.sla_resolution_hours.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Service Config */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiSettings3Line className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Service Config</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Bandwidth Type</Label>
                <Select
                  value={bandwidthType}
                  onValueChange={(v) =>
                    setValue("bandwidth_type", v as ServiceFormValues["bandwidth_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_effort">Best Effort</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                    <SelectItem value="guaranteed_minimum">Guaranteed Minimum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {bandwidthType !== "best_effort" && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Contention Ratio</Label>
                  <Select
                    value={watch("contention_ratio")}
                    onValueChange={(v) =>
                      setValue("contention_ratio", v as ServiceFormValues["contention_ratio"])
                    }
                    disabled={isDetailMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="1:4">1:4</SelectItem>
                      <SelectItem value="1:8">1:8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Support Tier</Label>
                <Select
                  value={watch("support_tier")}
                  onValueChange={(v) =>
                    setValue("support_tier", v as ServiceFormValues["support_tier"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Maintenance Allowed</Label>
                <Switch
                  size="sm"
                  checked={maintenanceAllowed}
                  onCheckedChange={(v) => setValue("maintenance_allowed", v)}
                  disabled={isDetailMode}
                />
              </div>
              {maintenanceAllowed && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Maintenance Schedule
                  </Label>
                  <Input
                    placeholder="e.g. weekdays_02:00-06:00"
                    disabled={isDetailMode}
                    {...register("maintenance_schedule")}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
