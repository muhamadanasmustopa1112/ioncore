"use client";
 
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiMapPinRangeLine } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileGroupFormData } from "../../../api/post-profile-group";
 
type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
};
 
export function AddressConfigurationSection({ readOnly, isPending }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<ProfileGroupFormData>();
 
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiMapPinRangeLine className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">{t("nocProfileGroup.form.address.title", "Address Configuration")}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="local_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.address.localAddress", "Local Address")}</FormLabel>
                            <FormControl>
                                <Input placeholder="10.10.10.1" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="first_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.address.firstAddress", "First Address")}</FormLabel>
                            <FormControl>
                                <Input placeholder="10.10.10.2" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="last_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.address.lastAddress", "Last Address")}</FormLabel>
                            <FormControl>
                                <Input placeholder="10.10.10.254" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
