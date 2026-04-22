"use client";
 
import { useFormContext } from "react-hook-form";
import { RiGlobalLine, RiTerminalBoxLine } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BandwidthFormData } from "../../../api/post-bandwidth";
 
type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
};
 
export function DisplaySummarySection({ readOnly, isPending }: SectionProps) {
    const { control } = useFormContext<BandwidthFormData>();
 
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiGlobalLine className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">Mbps Display & Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="upload_mbps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload (Mbps)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="download_mbps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Download (Mbps)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="rate_limit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><RiTerminalBoxLine className="size-3" />Rate Limit String</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. 10M/10M" {...field} disabled={readOnly || isPending} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
