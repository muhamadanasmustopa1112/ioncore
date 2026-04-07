"use client";

import { RiMoneyDollarCircleLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCustomerStore } from "../../../store/customer";

export function BillingCommercialsSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
                <RiMoneyDollarCircleLine className="size-4 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Billing & Commercials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase">Collect VAT</Label>
                        <p className="text-[10px] text-muted-foreground">Using PPN from Plan</p>
                    </div>
                    <Switch
                        checked={formData.collectVat}
                        onCheckedChange={(c) => handleChange("collectVat", c)}
                        disabled={isDetailMode}
                    />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase">Automatic Prorate</Label>
                        <p className="text-[10px] text-muted-foreground">Calculate Prorate</p>
                    </div>
                    <Switch
                        checked={formData.autoProrate}
                        onCheckedChange={(c) => handleChange("autoProrate", c)}
                        disabled={isDetailMode}
                    />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                        <Label className="text-xs font-bold uppercase">Promo</Label>
                        <p className="text-[10px] text-muted-foreground">Activate Promo</p>
                    </div>
                    <Switch
                        checked={formData.promo}
                        onCheckedChange={(c) => handleChange("promo", c)}
                        disabled={isDetailMode}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-2">
                    <Label htmlFor="promoDuration" className="text-xs font-medium text-muted-foreground">Promo Duration</Label>
                    <Select value={formData.promoDuration} onValueChange={(v) => handleChange("promoDuration", v)} disabled={isDetailMode || !formData.promo}>
                        <SelectTrigger id="promoDuration">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1 MONTHS">1 MONTHS</SelectItem>
                            <SelectItem value="3 MONTHS">3 MONTHS</SelectItem>
                            <SelectItem value="6 MONTHS">6 MONTHS</SelectItem>
                            <SelectItem value="12 MONTHS">12 MONTHS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="discount" className="text-xs font-medium text-muted-foreground">Discount ( One Time )</Label>
                    <Input
                        id="discount"
                        type="number"
                        value={formData.discount || 0}
                        onChange={(e) => handleChange("discount", parseFloat(e.target.value))}
                        disabled={isDetailMode}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4 md:col-span-2">
                    <div className="space-y-2">
                        <Label htmlFor="sellerFee" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Seller Fee</Label>
                        <Input
                            id="sellerFee"
                            type="number"
                            value={formData.sellerFee || 0}
                            onChange={(e) => handleChange("sellerFee", parseFloat(e.target.value))}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="installationFee" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Instalation Fee</Label>
                        <Input
                            id="installationFee"
                            type="number"
                            value={formData.installationFee || 0}
                            onChange={(e) => handleChange("installationFee", parseFloat(e.target.value))}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deviceFee" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Device Fee</Label>
                        <Input
                            id="deviceFee"
                            type="number"
                            value={formData.deviceFee || 0}
                            onChange={(e) => handleChange("deviceFee", parseFloat(e.target.value))}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 p-3 bg-primary/5 rounded border border-primary/10">
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                        <span className="font-bold text-primary italic underline">Nominal Writing :</span> Without thousands separator, use dot (.) for fractions.
                        Reseller Fee : can be set manually or set to zero ( 0 ) if you want to use fee from the profile sell price.
                    </p>
                </div>
            </div>
        </div>
    );
}
