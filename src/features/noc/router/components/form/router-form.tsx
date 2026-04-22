"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
    RiRouterLine,
    RiShieldKeyholeLine,
    RiGlobalLine,
    RiInformationLine,
    RiTimeLine,
} from "@remixicon/react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useRouterStore } from "../../store/router";
import { routerSchema, RouterFormData, useCreateRouter } from "../../api/post-router";
import { useUpdateRouter } from "../../api/put-router";
import { useGetRouter } from "../../api/get-router";

type RouterFormProps = {
    mode: "new" | "edit" | "details";
    onSuccess?: () => void;
    routerId?: string;
    readOnly?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export type RouterFormRef = {
    submit: () => void;
    isPending: boolean;
};

export const RouterForm = forwardRef<RouterFormRef, RouterFormProps>(
    ({ onSuccess, routerId, readOnly = false, mode }, ref) => {
        const { closeRouterFormSheet, selectedRouter } = useRouterStore();
        const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";


        const data = selectedRouter;
        const form = useForm<RouterFormData>({
            resolver: zodResolver(routerSchema),
            values: (data && mode !== "new") ? {
                shortname: data.shortname || "",
                nasname: data.nasname || "",
                time_zone: data.time_zone || "+07:00 Asia/Jakarta",
                ports: data.ports ? String(data.ports) : "0",
                secret: "********",
                description: data.description || "",
                community: "public",
                server: data.server || "+07:00 Asia/Jakarta",
                type: data.type || "other",
            } : {
                shortname: "",
                nasname: "",
                time_zone: "+07:00 Asia/Jakarta",
                ports: "0",
                secret: "",
                description: "Router NAS generated from Postman",
                community: "public",
                server: "+07:00 Asia/Jakarta",
                type: "other",
            }
        });

        const { mutate: createRouter, isPending: isCreating } = useCreateRouter({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeRouterFormSheet();
                    onSuccess?.();
                },
            },
        });

        const { mutate: updateRouter, isPending: isUpdating } = useUpdateRouter({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeRouterFormSheet();
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

        const onSubmit = (data: RouterFormData) => {
            const formData = { ...data, ports: parseInt(data.ports) };
            if (mode !== "new" && formData.secret === "********") delete (formData as any).secret;

            if (mode === "edit" && routerId) {
                updateRouter({ id: routerId, data: formData as any });
            } else {
                createRouter(formData as any);
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
                                            {/* General Configuration */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                                    <RiRouterLine className="size-4 text-blue-500" />
                                                    <h3 className="text-sm font-semibold">General Configuration</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="shortname"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Shortname (Name)</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Enter shortname" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="nasname"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>NAS Name (Address)</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. 10.108.57.69" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="time_zone"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel className="flex items-center gap-1.5"><RiTimeLine className="size-3" />Time Zone</FormLabel>
                                                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select Time Zone" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="+07:00 Asia/Jakarta">+07:00 Asia/Jakarta</SelectItem>
                                                                    <SelectItem value="+08:00 Asia/Singapore">+08:00 Asia/Singapore</SelectItem>
                                                                    <SelectItem value="+00:00 UTC">+00:00 UTC</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Connection Details */}
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                                    <RiGlobalLine className="size-4 text-purple-500" />
                                                    <h3 className="text-sm font-semibold">Connection Details</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="ports"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Auth Port</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="0" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="secret"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center gap-1.5"><RiShieldKeyholeLine className="size-3" />Radius Secret</FormLabel>
                                                                <FormControl>
                                                                    <Input type="password" placeholder="Enter secret" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Additional Info */}
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                                    <RiInformationLine className="size-4 text-slate-500" />
                                                    <h3 className="text-sm font-semibold">Additional Info</h3>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea placeholder="Add description..." className="min-h-[100px] resize-none" {...field} disabled={readOnly || isPending} />
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
    }
);

RouterForm.displayName = "RouterForm";
