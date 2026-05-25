"use client";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiInformationLine, RiDatabase2Line } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PPPProfileFormData } from "../../../api/post-ppp-profile";

type SectionProps = {
    isDetailMode?: boolean;
    isPending?: boolean;
    isNewMode?: boolean;
};

export function GeneralInformationSection({ isDetailMode, isPending, isNewMode }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<PPPProfileFormData>();

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">{t("pppProfile.generalInformation", "General Information")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.profileName", "Profile Name")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || isPending} className="h-10" placeholder={t("pppProfile.profileNamePlaceholder", "e.g. PPP Basic")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.profileCode", "Profile Code")}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isDetailMode || !isNewMode || isPending} className="h-10 uppercase" placeholder={t("pppProfile.profileCodePlaceholder", "e.g. PPP-BASIC")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="data_owner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.dataOwner", "Data Owner")}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                    <RiDatabase2Line className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="attributes.realm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.realm", "Realm")}</FormLabel>
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
