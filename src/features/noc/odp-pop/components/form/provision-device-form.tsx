"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiInformationLine, RiPulseLine, RiSettings4Line } from "@remixicon/react";
import { useProvisioningStore } from "../../store/provisioning";
import { DEFAULT_PROVISIONING_VALUES, ProvisioningFormValues, provisioningSchema } from "../../types/provisioning";

export function ProvisionDeviceForm() {
  const { closeProvisioningSheet } = useProvisioningStore();

  const form = useForm<ProvisioningFormValues>({
    resolver: zodResolver(provisioningSchema),
    defaultValues: DEFAULT_PROVISIONING_VALUES as ProvisioningFormValues,
  });

  async function onSubmit(data: ProvisioningFormValues) {
    console.log("Provisioning data:", data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Device provisioned successfully");
    closeProvisioningSheet();
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        id="provision-device-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col overflow-hidden"
      >
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-8 pb-6">
            {/* Device Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">Device Identification</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Device Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OLT">OLT</SelectItem>
                          <SelectItem value="SWITCH">Switch</SelectItem>
                          <SelectItem value="ROUTER">Router</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Serial Number (Warehouse)</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        // Mock auto-filling name and model based on SN
                        if (val === "SN-RAISECOM-001") {
                          form.setValue("deviceName", "OLT CONDET 1");
                          form.setValue("deviceModel", "Raisecom ISCOM5508");
                        } else if (val === "SN-ZTE-002") {
                          form.setValue("deviceName", "OLT CIRACAS 2");
                          form.setValue("deviceModel", "ZTE ZXA10 C320");
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from Warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SN-RAISECOM-001">SN-RAISECOM-001 (Raisecom)</SelectItem>
                          <SelectItem value="SN-ZTE-002">SN-ZTE-002 (ZTE)</SelectItem>
                          <SelectItem value="SN-HW-003">SN-HW-003 (Huawei)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Device Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. OLT-JKT-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deviceModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Raisecom ISCOM5508" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Network Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiSettings4Line className="size-4 text-purple-500" />
                <h3 className="text-sm font-semibold">Network Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ipAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">IP Address</FormLabel>
                      <FormControl>
                        <Input placeholder="10.1.x.x" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="macAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">MAC Address</FormLabel>
                      <FormControl>
                        <Input placeholder="AA:BB:CC:DD:EE:FF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Operational Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiPulseLine className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">Operational Status</h3>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="standby">Standby</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
