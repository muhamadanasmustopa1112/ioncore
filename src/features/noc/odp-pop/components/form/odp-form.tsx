"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import {
  RiSignalTowerLine,
  RiMapPinLine,
  RiInformationLine,
  RiHashtag,
  RiStackLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

import { DEFAULT_ODP_VALUES, OdpData, odpSchema, type OdpFormValues, type OdpPayload } from "../../types/odp";
import { useOdpStore } from "../../store/odp";
import { useCreateOdp } from "../../api/create-odp";
import { useUpdateOdp } from "../../api/update-odp";

type OdpFormProps = {
  mode: "new" | "edit" | "details";
  onSuccess?: () => void;
  odpId?: string;
  readOnly?: boolean;
};

export type OdpFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const OdpForm = forwardRef<OdpFormRef, OdpFormProps>(
  ({ onSuccess, odpId, readOnly = false, mode }, ref) => {
    const params = useParams();
    const { closeOdpFormSheet, selectedOdp } = useOdpStore();

    const urlOltId = params?.id as string;

    const data = selectedOdp;

    const mapOdpToFormValues = (odp: OdpData): any => ({
      code: odp.code ?? "",
      name: odp.name,
      gps_lat: odp.gps_lat?.toString() ?? "0",
      gps_lng: odp.gps_lng?.toString() ?? "0",
      olt_id: odp.olt_id ?? urlOltId ?? "",
      parent_id: (odp as any).parent_id ?? null,
      status: odp.status ?? "UP",
      total_port: odp.total_port ?? 16,
    });

    const form = useForm<any>({
      resolver: zodResolver(odpSchema),
      values: (data && mode !== "new") ? mapOdpToFormValues(data) : {
        ...DEFAULT_ODP_VALUES,
        gps_lat: "0",
        gps_lng: "0",
        olt_id: urlOltId || "",
      },
    });

    const { mutate: createOdp, isPending: isCreating } = useCreateOdp({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOdpFormSheet();
          onSuccess?.();
        },
      },
    });

    const { mutate: updateOdp, isPending: isUpdating } = useUpdateOdp({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOdpFormSheet();
          onSuccess?.();
        },
      },
    });

    const isPending = isCreating || isUpdating;

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isPending,
    }));

    const onSubmit = (formData: OdpFormValues) => {
      // Parse coordinates to number before sending to API
      const payload: OdpPayload = {
        ...formData,
        gps_lat: formData.gps_lat === "" ? 0 : Number(formData.gps_lat),
        gps_lng: formData.gps_lng === "" ? 0 : Number(formData.gps_lng),
        total_port: Number(formData.total_port),
      };

      if (mode === "edit" && odpId) {
        updateOdp({ id: odpId, data: payload });
      } else {
        createOdp(payload);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-8 pb-6">
              {/* General Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <RiSignalTowerLine className="size-4 text-blue-500" />
                  <h3 className="text-sm font-semibold">General Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <RiHashtag className="size-3" />
                          Code
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="ODP-LBN-001" {...field} disabled={readOnly || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">ODP Name</FormLabel>
                        <FormControl>
                          <Input placeholder="ODP LABUAN MAIN" {...field} disabled={readOnly || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <RiStackLine className="size-3" />
                          Total Ports
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="16"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                            disabled={readOnly || isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <RiInformationLine className="size-3" />
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={readOnly || isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UP">Up</SelectItem>
                            <SelectItem value="DOWN">Down</SelectItem>
                            <SelectItem value="DEGRADED">Degraded</SelectItem>
                            <SelectItem value="UNKNOWN">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Coordinates Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                  <RiMapPinLine className="size-4 text-purple-500" />
                  <h3 className="text-sm font-semibold">Location Coordinates</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="gps_lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <RiMapPinLine className="size-3" />
                          Latitude
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="-6.12345"
                            {...field}
                            disabled={readOnly || isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gps_lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <RiMapPinLine className="size-3" />
                          Longitude
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="106.12345"
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
            </div>
          </ScrollArea>
        </form>
      </Form>
    );
  }
);

OdpForm.displayName = "OdpForm";
