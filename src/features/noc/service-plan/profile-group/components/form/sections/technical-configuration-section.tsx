"use client";
 
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiGlobalLine } from "@remixicon/react";
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
import { ProfileGroupFormData } from "../../../api/post-profile-group";
 
type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
};
 
export function TechnicalConfigurationSection({ readOnly, isPending }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<ProfileGroupFormData>();
 
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiGlobalLine className="size-4 text-purple-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">{t("nocProfileGroup.form.technical.title", "Technical Configuration")}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="profile_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.technical.profileType", "Profile Type")}</FormLabel>
                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("nocProfileGroup.form.technical.selectType", "Select Type")} />
                                    </SelectTrigger>
                                </FormControl>
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
                    control={control}
                    name="module"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.technical.module", "Module")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocProfileGroup.form.technical.modulePlaceholder", "e.g. GROUP ONLY")} {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="parent_pool"
                render={({ field }) => (
                    <FormItem className="md:w-1/2">
                        <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.technical.parentPool", "Parent Pool")}</FormLabel>
                        <FormControl>
                            <Input placeholder={t("nocProfileGroup.form.technical.parentPoolPlaceholder", "e.g. none")} {...field} disabled={readOnly || isPending} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
