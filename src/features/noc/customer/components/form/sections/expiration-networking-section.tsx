"use client";

import { RiGlobalLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCustomerStore } from "../../../store/customer";

export function ExpirationNetworkingSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-4">
                <RiGlobalLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Expiration & Networking</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-2">
                    <Label htmlFor="expired_on" className="text-xs font-medium text-muted-foreground">Expired On (Due Date)</Label>
                    <Input
                        id="expired_on"
                        type="datetime-local"
                        value={formData.expired_on || ""}
                        onChange={(e) => handleChange("expired_on", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="renewed_on" className="text-xs font-medium text-muted-foreground">Renewed On</Label>
                    <Input
                        id="renewed_on"
                        type="datetime-local"
                        value={formData.renewed_on || ""}
                        onChange={(e) => handleChange("renewed_on", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="remote_address" className="text-xs font-medium text-muted-foreground">Remote Address (IP)</Label>
                    <Select 
                        value={formData.remote_address === "Automatic" ? "Automatic" : "Static"} 
                        onValueChange={(v) => handleChange("remote_address", v === "Automatic" ? "Automatic" : "")} 
                        disabled={isDetailMode}
                    >
                        <SelectTrigger id="remote_address_type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Static">Static IP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.remote_address !== "Automatic" && (
                    <div className="space-y-2">
                        <Label htmlFor="remote_address" className="text-xs font-medium text-muted-foreground">Static IP Address</Label>
                        <Input
                            id="remote_address"
                            placeholder="e.g. 10.0.0.1"
                            value={formData.remote_address || ""}
                            onChange={(e) => handleChange("remote_address", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="mac_address" className="text-xs font-medium text-muted-foreground">MAC Address (Optional)</Label>
                    <Input
                        id="mac_address"
                        placeholder="AA:BB:CC:DD:EE:11"
                        value={formData.mac_address || ""}
                        onChange={(e) => handleChange("mac_address", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-100">
                <p className="text-[10px] text-amber-700 italic">
                    If remote address not set, it will be automatically assigned by the server.
                </p>
            </div>
        </div>
    );
}
