"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Form,
} from "@/components/ui/form";
 
import { useBandwidthStore } from "../../store/bandwidth";
import { BandwidthFormData, bandwidthSchema, useCreateBandwidth } from "../../api/post-bandwidth";
import { useUpdateBandwidth } from "../../api/put-bandwidth";
import { GeneralInformationSection } from "./sections/general-information-section";
import { GranularRateSection } from "./sections/granular-rate-section";
import { DisplaySummarySection } from "./sections/display-summary-section";

type BandwidthFormProps = {
    mode: "new" | "edit" | "details";
    onSuccess?: () => void;
    bandwidthCode?: string;
    readOnly?: boolean;
};

export type BandwidthFormRef = {
    submit: () => void;
    isPending: boolean;
};

export const BandwidthForm = forwardRef<BandwidthFormRef, BandwidthFormProps>(
    ({ onSuccess, bandwidthCode, readOnly = false, mode }, ref) => {
        const { closeBandwidthFormSheet, selectedBandwidth } = useBandwidthStore();
        const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";

        const data = selectedBandwidth;

        const form = useForm<BandwidthFormData>({
            resolver: zodResolver(bandwidthSchema) as any,
            values: (data && mode !== "new") ? {
                name: data.name || "",
                code: data.code || "",
                data_owner: data.data_owner || "",
                download_mbps: String(data.download_mbps ?? 0),
                upload_mbps: String(data.upload_mbps ?? 0),
                min_rate_up: String(data.min_rate_up ?? 0),
                max_rate_up: String(data.max_rate_up ?? 0),
                min_rate_down: String(data.min_rate_down ?? 0),
                max_rate_down: String(data.max_rate_down ?? 0),
                min_rate_up_unit: data.min_rate_up_unit || "Mbps",
                max_rate_up_unit: data.max_rate_up_unit || "Mbps",
                min_rate_down_unit: data.min_rate_down_unit || "Mbps",
                max_rate_down_unit: data.max_rate_down_unit || "Mbps",
                rate_limit: data.rate_limit || "",
                attributes: {
                    service_profile: data.attributes?.service_profile || "residential",
                },
            } : {
                name: "",
                code: "",
                data_owner: "radius_admin",
                download_mbps: "0",
                upload_mbps: "0",
                min_rate_up: "0",
                max_rate_up: "0",
                min_rate_down: "0",
                max_rate_down: "0",
                min_rate_up_unit: "Mbps",
                max_rate_up_unit: "Mbps",
                min_rate_down_unit: "Mbps",
                max_rate_down_unit: "Mbps",
                rate_limit: "",
                attributes: {
                    service_profile: "residential",
                },
            }
        });

        const { mutate: createBandwidth, isPending: isCreating } = useCreateBandwidth({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeBandwidthFormSheet();
                    onSuccess?.();
                },
            },
        });

        const { mutate: updateBandwidth, isPending: isUpdating } = useUpdateBandwidth({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeBandwidthFormSheet();
                    onSuccess?.();
                },
            },
        });

        const isPending = isCreating || isUpdating;

        useImperativeHandle(ref, () => ({
            submit: () => {
                form.handleSubmit(onSubmit)();
            },
            isPending,
        }));

        const onSubmit = (formData: BandwidthFormData) => {
            const { code, ...restData } = formData;
            const payload = {
                ...restData,
                download_mbps: Number(formData.download_mbps),
                upload_mbps: Number(formData.upload_mbps),
                min_rate_up: Number(formData.min_rate_up),
                max_rate_up: Number(formData.max_rate_up),
                min_rate_down: Number(formData.min_rate_down),
                max_rate_down: Number(formData.max_rate_down),
            };

            if (mode === "edit" && bandwidthCode) {
                updateBandwidth({ code: bandwidthCode, data: payload as any });
            } else {
                createBandwidth(payload as any);
            }
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
                                            <GeneralInformationSection mode={mode} readOnly={readOnly} isPending={isPending} />
                                            <GranularRateSection readOnly={readOnly} isPending={isPending} />
                                            <DisplaySummarySection readOnly={readOnly} isPending={isPending} />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        );
    }
);

BandwidthForm.displayName = "BandwidthForm";
