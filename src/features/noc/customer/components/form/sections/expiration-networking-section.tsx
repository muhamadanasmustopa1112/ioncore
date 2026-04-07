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
                    <Label htmlFor="dueDate" className="text-xs font-medium text-muted-foreground">Change Due Date (Optional)</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate || ""}
                        onChange={(e) => handleChange("dueDate", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="expirationAction" className="text-xs font-medium text-muted-foreground">Action on Expiration</Label>
                    <Select value={formData.expirationAction} onValueChange={(v) => handleChange("expirationAction", v)} disabled={isDetailMode}>
                        <SelectTrigger id="expirationAction">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DISCONNECT INTERNET ( SUSPENDED )">DISCONNECT INTERNET ( SUSPENDED )</SelectItem>
                            <SelectItem value="DO NOTHING">DO NOTHING</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ipAddressType" className="text-xs font-medium text-muted-foreground">IP Address Tipe</Label>
                    <Select value={formData.ipAddressType} onValueChange={(v) => handleChange("ipAddressType", v)} disabled={isDetailMode}>
                        <SelectTrigger id="ipAddressType">
                            <SelectValue placeholder="Select IP Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Static">Static</SelectItem>
                            <SelectItem value="Dynamic">Dynamic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.ipAddressType === "Static" && (
                    <div className="space-y-2">
                        <Label htmlFor="ipAddress" className="text-xs font-medium text-muted-foreground">IP Address</Label>
                        <Input
                            id="ipAddress"
                            placeholder="e.g. 10.0.0.1"
                            value={formData.ipAddress || ""}
                            onChange={(e) => handleChange("ipAddress", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                )}
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-100">
                <p className="text-[10px] text-amber-700 italic">
                    Prorate & Duedate cannot changed if plan validty is unlimited or less than 3 days.
                    If duedate not set, automatic prorate will be ignored.
                </p>
            </div>
        </div>
    );
}
