"use client";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiSettings4Line, RiGroupLine, RiShieldLine } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProfileGroups } from "@/features/noc/service-plan/profile-group/api/get-profile-groups";
import { ProfileGroupItem } from "@/features/noc/service-plan/profile-group/types/profile-group";
import { PPPProfileFormData } from "../../../api/post-ppp-profile";

type SectionProps = {
    isDetailMode?: boolean;
    isPending?: boolean;
};

export function PlanConfigurationSection({ isDetailMode, isPending }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<PPPProfileFormData>();

    const { data: profileGroupResponse, isLoading: isLoadingGroups } = useProfileGroups({
        params: { limit: 100, page: 1 }
    });
    const profileGroups = profileGroupResponse?.data || [];

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiSettings4Line className="size-4 text-orange-500" />
                <h3 className="text-sm font-semibold">{t("pppProfile.planConfiguration", "Plan Configuration")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <FormField
                    control={control}
                    name="profile_group"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.profileGroup", "Profile Group")}</FormLabel>
                            <Select disabled={isDetailMode || isPending || isLoadingGroups} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 pl-9">
                                        <RiGroupLine className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <SelectValue placeholder={isLoadingGroups ? t("common.loading") : t("pppProfile.selectGroup", "Select Group")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {profileGroups.map((group: ProfileGroupItem) => (
                                        <SelectItem key={group.id} value={group.code}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="plan_validity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.planValidity", "Plan Validity")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10" placeholder={t("pppProfile.planValidityPlaceholder", "e.g. 30 Days")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="shared_users"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.sharedUsers", "Shared Users")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="service_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.serviceType", "Service Type")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="privileges"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.privileges", "Privileges")}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                    <RiShieldLine className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="vat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.vat", "VAT")}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} disabled={isDetailMode || isPending} className="h-10 pr-8 text-right" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="promo"
                    render={({ field }) => (
                        <FormItem className="md:col-span-3">
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.promo", "Promo")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    );
}
