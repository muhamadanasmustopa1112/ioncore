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
import { useCustomerStore } from "../../../store/customer";
import { Input } from "@/components/ui/input";

export function ServiceConfigurationSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <RiShieldCheckLine className="size-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Service Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="server_name" className="text-xs font-medium text-muted-foreground">Server Name</Label>
                            <Button variant="ghost" size="sm" className="h-6 text-primary hover:text-primary gap-1 px-1">
                                <RiAddLine className="size-3" />
                                Add Server
                            </Button>
                        </div>
                        <Select
                            value={formData.server_name || ""}
                            onValueChange={(v) => handleChange("server_name", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="server_name">
                                <SelectValue placeholder="Select Server" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pppoe-jakarta">pppoe-jakarta</SelectItem>
                                <SelectItem value="OPVN CLOUD SERVER">OPVN CLOUD SERVER</SelectItem>
                                <SelectItem value="LOCAL SERVER 01">LOCAL SERVER 01</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="auth_status" className="text-xs font-medium text-muted-foreground">Auth Status</Label>
                        <Select
                            value={formData.auth_status || "Enabled-Users"}
                            onValueChange={(v) => handleChange("auth_status", v)}
                            disabled={isDetailMode}
                        >
                            <Trigger id="auth_status">
                                <SelectValue />
                            </Trigger>
                            <SelectContent>
                                <SelectItem value="Enabled-Users">Enabled-Users</SelectItem>
                                <SelectItem value="Disabled-Users">Disabled-Users</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_type" className="text-xs font-medium text-muted-foreground">Payment Type</Label>
                        <Select value={formData.payment_type || "POSTPAID"} onValueChange={(v) => handleChange("payment_type", v)} disabled={isDetailMode}>
                            <SelectTrigger id="payment_type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="POSTPAID">POSTPAID</SelectItem>
                                <SelectItem value="PREPAID">PREPAID</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bind_mac" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Bind MAC</Label>
                        <Select
                            value={formData.bind_mac || "NO"}
                            onValueChange={(v) => handleChange("bind_mac", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="bind_mac">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YES">YES</SelectItem>
                                <SelectItem value="NO">NO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="servicetype" className="text-xs font-medium text-muted-foreground">Service Type</Label>
                        <Select value={formData.servicetype || "Framed-User"} onValueChange={(v) => handleChange("servicetype", v)} disabled={isDetailMode}>
                            <SelectTrigger id="servicetype">
                                <SelectValue placeholder="Select Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Framed-User">Framed-User</SelectItem>
                                <SelectItem value="Broadband">Broadband</SelectItem>
                                <SelectItem value="Dedicated">Dedicated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nasporttype" className="text-xs font-medium text-muted-foreground">NAS Port Type</Label>
                        <Select value={formData.nasporttype || "Ethernet"} onValueChange={(v) => handleChange("nasporttype", v)} disabled={isDetailMode}>
                            <SelectTrigger id="nasporttype">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ethernet">Ethernet</SelectItem>
                                <SelectItem value="Wireless">Wireless</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="plan_name" className="text-xs font-medium text-muted-foreground">Plan Name</Label>
                        <Select value={formData.plan_name || ""} onValueChange={(v) => handleChange("plan_name", v)} disabled={isDetailMode}>
                            <SelectTrigger id="plan_name">
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DEFAULT PPP">DEFAULT PPP</SelectItem>
                                <SelectItem value="Home 10Mbps">Home 10Mbps</SelectItem>
                                <SelectItem value="Home 25Mbps">Home 25Mbps</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bandwidth" className="text-xs font-medium text-muted-foreground">Bandwidth Code</Label>
                        <Input
                            id="bandwidth"
                            placeholder="bandwidth_code"
                            value={formData.bandwidth || ""}
                            onChange={(e) => handleChange("bandwidth", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to fix Trigger issue if it happens
const Trigger = SelectTrigger;
