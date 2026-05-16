"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { PolygonPreview } from "@/features/administration/branch/components/form/polygon-preview";
import { PopFormValues } from "../../../types/pop";

type LocationInfoSectionProps = {
    readOnly: boolean;
    isPending: boolean;
};

export function LocationInfoSection({
    readOnly,
    isPending,
}: LocationInfoSectionProps) {
    const { control, watch, setValue } = useFormContext<PopFormValues>();

    const lat = watch("gps_lat");
    const lng = watch("gps_lng");

    const parsedLat = lat ? parseFloat(lat) : undefined;
    const parsedLng = lng ? parseFloat(lng) : undefined;

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

                {/* Hidden fields to keep form state */}
                <input type="hidden" {...control.register("gps_lng")} />

                <FormField
                    control={control}
                    name="gps_lat"
                    render={({ fieldState }) => (
                        <div className="col-span-2 mt-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <RiMapPinLine className="size-4 text-emerald-500" />
                                    <span className="text-sm font-medium">Coordinate Picker</span>
                                </div>
                                {(lat || lng) && (
                                    <div className="flex gap-3 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                        <span>Lat: {lat || "-"}</span>
                                        <span>Lng: {lng || "-"}</span>
                                    </div>
                                )}
                            </div>
                            <div className={cn(
                                "rounded-md border p-0.5 transition-colors",
                                fieldState.error ? "border-destructive bg-destructive/5" : "border-transparent"
                            )}>
                                <PolygonPreview
                                    pinLat={parsedLat}
                                    pinLng={parsedLng}
                                    onPinChange={readOnly ? undefined : (newLat, newLng) => {
                                        setValue("gps_lat", newLat.toString(), { shouldValidate: true });
                                        setValue("gps_lng", newLng.toString(), { shouldValidate: true });
                                    }}
                                    readOnly={readOnly}
                                />
                            </div>
                            {fieldState.error && (
                                <p className="text-[0.8rem] font-medium text-destructive mt-2">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
