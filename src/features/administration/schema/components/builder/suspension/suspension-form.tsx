"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationLine } from "@remixicon/react";
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
import { suspensionFormSchema, type SuspensionFormValues } from "../../../types/suspension-schema";
import { useSchemaStore } from "../../../store/schema";
import { SuspensionRulesSection } from "./suspension-rules-section";
import { RestorationTerminationSection } from "./restoration-termination-section";

const DEFAULT_SUSPENSION: SuspensionFormValues = {
  name: "",
  customer_type: "residential",
  suspension_automatic: true,
  suspension_trigger: "after_grace_period",
  suspension_requires_manual_approval: false,
  suspension_requires_executive_approval: false,
  suspension_ion_radius_action: "full_block",
  suspension_throttle_speed_kbps: 512,
  suspension_notification: true,
  suspension_notification_channels: ["whatsapp"],
  restoration_automatic: true,
  restoration_trigger: "on_payment_confirmed",
  restoration_requires_manual_trigger: false,
  restoration_requires_approval: false,
  termination_enabled: false,
  termination_trigger_basis: "days_after_suspension",
  termination_days: 30,
  termination_notify_customer_days_before: 7,
  termination_auto_create_wo: true,
  termination_requires_approval: false,
};

export function SuspensionForm() {
  const { form } = useSchemaStore();
  const isDetailMode = form === "details";

  const rhfForm = useForm<SuspensionFormValues>({
    resolver: zodResolver(suspensionFormSchema),
    defaultValues: DEFAULT_SUSPENSION,
  });

  const { register, watch, setValue, formState: { errors } } = rhfForm;

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
                  placeholder="e.g. Residential Suspension Schema"
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
                    setValue("customer_type", v as SuspensionFormValues["customer_type"])
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

          <SuspensionRulesSection form={rhfForm} disabled={isDetailMode} />

          <RestorationTerminationSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
