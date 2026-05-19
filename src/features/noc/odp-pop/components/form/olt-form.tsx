"use client";

import { useImperativeHandle, forwardRef, useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import {
  RiCpuLine,
  RiInformationLine,
  RiNodeTree,
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

import { DEFAULT_OLT_VALUES, OltData, oltSchema, type OltFormValues } from "../../types/olt";
import { useOltStore } from "../../store/olt";
import { useCreateOlt } from "../../api/create-olt";
import { useUpdateOlt } from "../../api/update-olt";
import { useOlt } from "../../api/get-olt";

type OltFormProps = {
  mode: "new" | "edit" | "details";
  onSuccess?: () => void;
  oltId?: string;
  readOnly?: boolean;
};

export type OltFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const OltForm = forwardRef<OltFormRef, OltFormProps>(
  ({ onSuccess, oltId, readOnly = false, mode }, ref) => {
    const params = useParams();
    const { closeOltFormSheet, selectedOlt } = useOltStore();

    // Get IDs from URL if available
    const urlPopId = params?.id as string;
    // Note: If we are in OLT detail, params.id might be parent_id. 
    // But for now, in POP Detail page, params.id is the pop_id.

    const data = selectedOlt;

    const { data: oltListRes } = useOlt({ params: { limit: 1000 } });

    const nextSuffix = useMemo(() => {
      if (mode !== "new" && data?.code) {
        const match = data.code.match(/-(\d+)$/);
        return match ? match[1] : "001";
      }
      const codes = oltListRes?.data?.map((o) => o.code) || [];
      const numbers = codes
        .map((code) => {
          if (!code) return 0;
          const match = code.match(/-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(Boolean);
      const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return nextNum.toString().padStart(3, "0");
    }, [oltListRes, data, mode]);

    const mapOltToFormValues = (olt: OltData): OltFormValues => ({
      code: olt.code ?? "",
      name: olt.name,
      parent_id: olt.parent_id ?? null,
      pop_id: olt.pop_id ?? urlPopId ?? "",
      status: olt.status ?? "UP",
      total_port: olt.total_port ?? 16,
    });

    const form = useForm<OltFormValues>({
      resolver: zodResolver(oltSchema),
      values: (data && mode !== "new") ? mapOltToFormValues(data) : {
        ...DEFAULT_OLT_VALUES,
        pop_id: urlPopId || "",
      } as OltFormValues,
    });

    const codeValue = form.watch("code") || "";

    const getMiddlePart = (fullCode: string) => {
      if (!fullCode) return "";
      const parts = fullCode.split("-");
      if (parts.length > 2) {
        return parts.slice(1, -1).join("-");
      }
      return "";
    };

    const [middle, setMiddle] = useState(() => getMiddlePart(codeValue));

    // Keep middle in sync with full code when loaded/selected OLT changes
    useEffect(() => {
      setMiddle(getMiddlePart(codeValue));
    }, [codeValue]);

    // Handle change of the middle part
    const handleMiddleChange = (val: string) => {
      const cleaned = val.toUpperCase().replace(/[^A-Z0-9_]/g, "");
      setMiddle(cleaned);
      form.setValue("code", cleaned ? `OLT-${cleaned}-${nextSuffix}` : "", { shouldValidate: true });
    };

    // Ensure code is synced on mount/when nextSuffix changes for new mode
    useEffect(() => {
      if (mode === "new" && middle) {
        form.setValue("code", `OLT-${middle}-${nextSuffix}`, { shouldValidate: true });
      }
    }, [middle, nextSuffix, mode, form]);

    const { mutate: createOlt, isPending: isCreating } = useCreateOlt({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOltFormSheet();
          onSuccess?.();
        },
      },
    });

    const { mutate: updateOlt, isPending: isUpdating } = useUpdateOlt({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOltFormSheet();
          onSuccess?.();
        },
      },
    });

    const isPending = isCreating || isUpdating;

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isPending,
    }));

    const onSubmit = (formData: OltFormValues) => {
      const payload = {
        ...formData,
        parent_id: formData.parent_id === "none" ? null : formData.parent_id,
      };

      if (mode === "edit" && oltId) {
        updateOlt({ id: oltId, data: payload });
      } else {
        createOlt(payload);
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
                  <RiCpuLine className="size-4 text-blue-500" />
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
                          <div className="flex items-center rounded-lg border border-input bg-background pl-3 focus-within:ring-1 focus-within:ring-ring h-10 w-full">
                            <span className="text-sm font-semibold text-muted-foreground/60 select-none">OLT-</span>
                            <Input
                              className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-sm uppercase h-full bg-transparent font-medium"
                              placeholder="LOCATION"
                              value={middle}
                              onChange={(e) => handleMiddleChange(e.target.value)}
                              disabled={readOnly || isPending || mode !== "new"}
                            />
                            <span className="text-sm font-semibold text-muted-foreground/60 select-none pr-3">-{nextSuffix}</span>
                          </div>
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
                        <FormLabel className="text-xs font-medium text-muted-foreground">OLT Name</FormLabel>
                        <FormControl>
                          <Input placeholder="JAKARTA PUSAT MAIN OLT" {...field} disabled={readOnly || isPending} />
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
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value?.toString()}
                          disabled={readOnly || isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Ports" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="28">28</SelectItem>
                            <SelectItem value="32">32</SelectItem>
                          </SelectContent>
                        </Select>
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
            </div>
          </ScrollArea>
        </form>
      </Form>
    );
  }
);

OltForm.displayName = "OltForm";
