"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
 
import { useProfileGroupStore } from "../../store/profile-group";
import {
    profileGroupSchema,
    ProfileGroupFormData,
    useCreateProfileGroup
} from "../../api/post-profile-group";
import { useUpdateProfileGroup } from "../../api/put-profile-group";
import { useRouters } from "@/features/noc/router/api/get-routers";
import { RouterItem } from "@/features/noc/router/types";
import { ProfileInformationSection } from "./sections/profile-information-section";
import { TechnicalConfigurationSection } from "./sections/technical-configuration-section";
import { AddressConfigurationSection } from "./sections/address-configuration-section";


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
            params: { length: 100, start: 0 }
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
                                            <ProfileInformationSection
                                                readOnly={readOnly}
                                                isPending={isPending}
                                                routers={routers}
                                                isLoadingRouters={isLoadingRouters}
                                            />
                                            <TechnicalConfigurationSection
                                                readOnly={readOnly}
                                                isPending={isPending}
                                            />
                                            <AddressConfigurationSection
                                                readOnly={readOnly}
                                                isPending={isPending}
                                            />
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
