"use client";

import { useState } from "react";
import {
    RiGlobalLine,
    RiInformationLine,
    RiStickyNoteLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBandwidthStore } from "../../store/bandwidth";

export function BandwidthForm() {
    const { form } = useBandwidthStore();
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    // Form states
    const [bandwidthName, setBandwidthName] = useState(isEditMode || isDetailMode ? "SME Starter 50M" : "");
    const [dataOwner, setDataOwner] = useState(isEditMode || isDetailMode ? "Sales Retail" : "");
    const [uploadMin, setUploadMin] = useState(isEditMode || isDetailMode ? "10" : "");
    const [uploadMax, setUploadMax] = useState(isEditMode || isDetailMode ? "50" : "");
    const [downloadMin, setDownloadMin] = useState(isEditMode || isDetailMode ? "10" : "");
    const [downloadMax, setDownloadMax] = useState(isEditMode || isDetailMode ? "50" : "");
    const [unit, setUnit] = useState(isEditMode || isDetailMode ? "Mbps" : "Mbps");
    const [description, setDescription] = useState(isEditMode || isDetailMode ? "Standard package for small businesses" : "");

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-8 pb-6">
                    {/* General Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <RiInformationLine className="size-4 text-blue-500" />
                            <h3 className="text-sm font-semibold">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bandwidthName" className="text-xs font-medium text-muted-foreground">Bandwidth Name</Label>
                                <Input
                                    id="bandwidthName"
                                    placeholder="e.g. SME Starter 50M"
                                    value={bandwidthName}
                                    onChange={(e) => setBandwidthName(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataOwner" className="text-xs font-medium text-muted-foreground">Data Owner / Department</Label>
                                <Input
                                    id="dataOwner"
                                    placeholder="e.g. Sales Retail"
                                    value={dataOwner}
                                    onChange={(e) => setDataOwner(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bandwidth Limits Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiGlobalLine className="size-4 text-purple-500" />
                            <h3 className="text-sm font-semibold">Bandwidth Limits & Speed</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="uploadMin" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                            Upload Min
                                        </Label>
                                        <Input
                                            id="uploadMin"
                                            type="number"
                                            placeholder="Min Speed"
                                            value={uploadMin}
                                            onChange={(e) => setUploadMin(e.target.value)}
                                            disabled={isDetailMode}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="uploadMax" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                            Upload Max
                                        </Label>
                                        <Input
                                            id="uploadMax"
                                            type="number"
                                            placeholder="Max Speed"
                                            value={uploadMax}
                                            onChange={(e) => setUploadMax(e.target.value)}
                                            disabled={isDetailMode}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="downloadMin" className="text-xs font-medium text-muted-foreground">Download Min</Label>
                                        <Input
                                            id="downloadMin"
                                            type="number"
                                            placeholder="Min Speed"
                                            value={downloadMin}
                                            onChange={(e) => setDownloadMin(e.target.value)}
                                            disabled={isDetailMode}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="downloadMax" className="text-xs font-medium text-muted-foreground">Download Max</Label>
                                        <Input
                                            id="downloadMax"
                                            type="number"
                                            placeholder="Max Speed"
                                            value={downloadMax}
                                            onChange={(e) => setDownloadMax(e.target.value)}
                                            disabled={isDetailMode}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="unit" className="text-xs font-medium text-muted-foreground">Speed Unit</Label>
                                {isDetailMode ? (
                                    <Input value={unit} disabled />
                                ) : (
                                    <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger id="unit">
                                            <SelectValue placeholder="Select Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kbps">Kbps (Kilobits)</SelectItem>
                                            <SelectItem value="Mbps">Mbps (Megabits)</SelectItem>
                                            <SelectItem value="Gbps">Gbps (Gigabits)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiStickyNoteLine className="size-4 text-slate-500" />
                            <h3 className="text-sm font-semibold">Additional Details</h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Notes / Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter any additional information about this bandwidth configuration..."
                                className="min-h-[100px] resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isDetailMode}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
