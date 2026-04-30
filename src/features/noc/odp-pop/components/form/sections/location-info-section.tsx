"use client";

import { useFormContext } from "react-hook-form";
import { RiMapPinLine, RiCompass3Line, RiMapPin2Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PopFormValues } from "../../../types/pop";

type LocationInfoSectionProps = {
    readOnly: boolean;
    isPending: boolean;
};

export function LocationInfoSection({
    readOnly,
    isPending,
}: LocationInfoSectionProps) {
    const { control } = useFormContext<PopFormValues>();

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiCompass3Line className="size-4 text-purple-500" />
                <h3 className="text-sm font-semibold">Location Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiMapPin2Line className="size-3" />
                                Address
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter full address..."
                                    className="min-h-[80px] resize-none"
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={readOnly || isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="gps_lat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiMapPinLine className="size-3" />
                                Latitude
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="-6.12345"
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={readOnly || isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="gps_lng"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiMapPinLine className="size-3" />
                                Longitude
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="106.12345"
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={readOnly || isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
