"use client";

import { RiShieldCheckLine, RiAddLine } from "@remixicon/react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useCustomerStore } from "../../../store/customer";

export function ServiceConfigurationSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Registration Status</Label>
                    <RadioGroup
                        value={formData.registrationStatus}
                        onValueChange={(v) => handleChange("registrationStatus", v)}
                        className="flex gap-4"
                        disabled={isDetailMode}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="status-active" />
                            <Label htmlFor="status-active" className="font-medium cursor-pointer">ACTIVE NOW</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="process" id="status-process" />
                            <Label htmlFor="status-process" className="font-medium cursor-pointer">ON PROCESS</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Type</Label>
                    <RadioGroup
                        value={formData.customerType}
                        onValueChange={(v) => handleChange("customerType", v)}
                        className="flex gap-4"
                        disabled={isDetailMode}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="type-regular" />
                            <Label htmlFor="type-regular" className="font-medium cursor-pointer">Regular</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non-regular" id="type-non-regular" />
                            <Label htmlFor="type-non-regular" className="font-medium cursor-pointer">Non-Regular</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <RiShieldCheckLine className="size-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Service Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="serverName" className="text-xs font-medium text-muted-foreground">Server | Service Name</Label>
                            <Button variant="ghost" size="sm" className="h-6 text-primary hover:text-primary gap-1 px-1">
                                <RiAddLine className="size-3" />
                                Add Server Name
                            </Button>
                        </div>
                        <Select
                            value={formData.serverName}
                            onValueChange={(v) => handleChange("serverName", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="serverName">
                                <SelectValue placeholder="Select Server" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPVN CLOUD SERVER">OPVN CLOUD SERVER</SelectItem>
                                <SelectItem value="LOCAL SERVER 01">LOCAL SERVER 01</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Payment Type</Label>
                        <Badge variant="outline" appearance="light" className="w-full h-10 px-3 justify-start font-bold uppercase text-primary border-primary/20 bg-primary/5">
                            {formData.paymentType || "PREPAID"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Pay Status</Label>
                            <Badge variant="outline" appearance="light" className="w-full h-10 px-3 justify-center font-bold uppercase text-emerald-600 border-emerald-200 bg-emerald-50">
                                {formData.payStatus || "PAID"}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Account Status</Label>
                            <Badge variant="outline" appearance="light" className="w-full h-10 px-3 justify-center font-bold uppercase text-blue-600 border-blue-200 bg-blue-50">
                                {formData.accountStatus || "ENABLED"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dataOwner" className="text-xs font-medium text-muted-foreground">Data Owner</Label>
                        <Select value={formData.dataOwner} onValueChange={(v) => handleChange("dataOwner", v)} disabled={isDetailMode}>
                            <SelectTrigger id="dataOwner">
                                <SelectValue placeholder="Select Owner" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Reseller A">Reseller A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bindOnLogin" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Bind On Login</Label>
                        <Select
                            value={formData.bindOnLogin ? "YES" : "NO"}
                            onValueChange={(v) => handleChange("bindOnLogin", v === "YES")}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="bindOnLogin">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YES">YES</SelectItem>
                                <SelectItem value="NO">NO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-xs font-medium text-muted-foreground">Service Type</Label>
                        <Select value={formData.serviceType} onValueChange={(v) => handleChange("serviceType", v)} disabled={isDetailMode}>
                            <SelectTrigger id="serviceType">
                                <SelectValue placeholder="Select Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Broadband">Broadband</SelectItem>
                                <SelectItem value="Dedicated">Dedicated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="servicePlan" className="text-xs font-medium text-muted-foreground">Service Plan</Label>
                        <Select value={formData.servicePlan} onValueChange={(v) => handleChange("servicePlan", v)} disabled={isDetailMode}>
                            <SelectTrigger id="servicePlan">
                                <SelectValue placeholder="Select Service Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Home 10Mbps">Home 10Mbps</SelectItem>
                                <SelectItem value="Home 25Mbps">Home 25Mbps</SelectItem>
                                <SelectItem value="Home 50Mbps">Home 50Mbps</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
