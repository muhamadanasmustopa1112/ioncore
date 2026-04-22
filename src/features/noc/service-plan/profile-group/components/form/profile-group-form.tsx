"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
    RiGlobalLine,
    RiInformationLine,
    RiMapPinRangeLine,
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useProfileGroupStore } from "../../store/profile-group";
import {
    profileGroupSchema,
    ProfileGroupFormData,
    useCreateProfileGroup
} from "../../api/post-profile-group";
import { useUpdateProfileGroup } from "../../api/put-profile-group";
import { useRouters } from "@/features/noc/router/api/get-routers";
import { RouterItem } from "@/features/noc/router/types";

type ProfileGroupFormProps = {
    mode: "new" | "edit" | "details";
    onSuccess?: () => void;
    profileGroupCode?: string;
    readOnly?: boolean;
};

export type ProfileGroupFormRef = {
    submit: () => void;
    isPending: boolean;
};

export const ProfileGroupForm = forwardRef<ProfileGroupFormRef, ProfileGroupFormProps>(
    ({ onSuccess, profileGroupCode, readOnly = false, mode }, ref) => {
        const { closeProfileGroupFormSheet, selectedProfileGroup } = useProfileGroupStore();
        const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";
        const isEditMode = mode === "edit";

        const { data: routerResponse, isLoading: isLoadingRouters } = useRouters({
            params: { length: 100, start: 1 }
        });
        const routers = routerResponse?.data || [];

        const data = selectedProfileGroup;

        const form = useForm<ProfileGroupFormData>({
            resolver: zodResolver(profileGroupSchema),
            values: (data && mode !== "new") ? {
                name: data.name || "",
                code: data.code || "",
                data_owner: data.data_owner || "Sales Retail",
                router_nas: data.router_nas || "",
                profile_type: data.profile_type || "PPP",
                module: data.module || "GROUP ONLY",
                local_address: data.local_address || "",
                first_address: data.first_address || "",
                last_address: data.last_address || "",
                parent_pool: data.parent_pool || "none",
            } : {
                name: "",
                code: "",
                data_owner: "Sales Retail",
                router_nas: "",
                profile_type: "PPP",
                module: "GROUP ONLY",
                local_address: "",
                first_address: "",
                last_address: "",
                parent_pool: "none",
            }
        });

        const { mutate: createProfileGroup, isPending: isCreating } = useCreateProfileGroup({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeProfileGroupFormSheet();
                    onSuccess?.();
                },
            },
        });

        const { mutate: updateProfileGroup, isPending: isUpdating } = useUpdateProfileGroup({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closeProfileGroupFormSheet();
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

        const onSubmit = (data: ProfileGroupFormData) => {
            if (isEditMode && profileGroupCode) {
                const { code, ...payload } = data;
                updateProfileGroup({ code: profileGroupCode, data: payload as any });
            } else {
                createProfileGroup(data);
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
                                            {/* Profile Information */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                                    <RiInformationLine className="size-4 text-blue-500" />
                                                    <h3 className="text-sm font-semibold uppercase tracking-wider">Profile Information</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Profile Group Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. Premium Home" {...field} disabled={readOnly || isPending} />
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
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Code</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. PREMIUM_HOME" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="data_owner"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Data Owner</FormLabel>
                                                                <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Data Owner" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="Sales Retail">Sales Retail</SelectItem>
                                                                        <SelectItem value="Enterprise Solutions">Enterprise Solutions</SelectItem>
                                                                        <SelectItem value="NOC Infrastructure">NOC Infrastructure</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="router_nas"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Router Nas</FormLabel>
                                                                <Select disabled={readOnly || isPending || isLoadingRouters} onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={isLoadingRouters ? "Loading..." : "Select Router"} />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {routers.map((router: RouterItem) => (
                                                                            <SelectItem key={router.id} value={router.shortname}>
                                                                                {router.shortname}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Technical Configuration */}
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                                    <RiGlobalLine className="size-4 text-purple-500" />
                                                    <h3 className="text-sm font-semibold uppercase tracking-wider">Technical Configuration</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="profile_type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Profile Type</FormLabel>
                                                                <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="HOTSPOT">HOTSPOT</SelectItem>
                                                                        <SelectItem value="PPP">PPP</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="module"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Module</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. GROUP ONLY" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="parent_pool"
                                                    render={({ field }) => (
                                                        <FormItem className="md:w-1/2">
                                                            <FormLabel className="text-xs text-muted-foreground uppercase">Parent Pool</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g. none" {...field} disabled={readOnly || isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Address Configuration */}
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                                    <RiMapPinRangeLine className="size-4 text-emerald-500" />
                                                    <h3 className="text-sm font-semibold uppercase tracking-wider">Address Configuration</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="local_address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Local Address</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="10.10.10.1" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="first_address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">First Address</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="10.10.10.2" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="last_address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground uppercase">Last Address</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="10.10.10.254" {...field} disabled={readOnly || isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
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

ProfileGroupForm.displayName = "ProfileGroupForm";
