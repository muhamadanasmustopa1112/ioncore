"use client";

import { useState } from "react";
import {
    RiRouterLine,
    RiShieldKeyholeLine,
    RiUserSettingsLine,
    RiGlobalLine,
    RiLink,
    RiInformationLine,
    RiTerminalLine,
    RiKeyLine,
    RiTimeLine
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
import { useRouterStore } from "../../store/router";

export function RouterForm() {
    const { form } = useRouterStore();
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    // Form states
    const [routerName, setRouterName] = useState(isEditMode || isDetailMode ? "OPVN CLOUD SERVER" : "");
    const [routerAddress, setRouterAddress] = useState(isEditMode || isDetailMode ? "10.108.57.69" : "");
    const [authPort, setAuthPort] = useState(isEditMode || isDetailMode ? "1812" : "");
    const [accPort, setAccPort] = useState(isEditMode || isDetailMode ? "1813" : "");
    const [apiPort, setApiPort] = useState(isEditMode || isDetailMode ? "8728" : "");
    const [timeZone, setTimeZone] = useState(isEditMode || isDetailMode ? "asia/jakarta" : "asia/jakarta");
    const [apiUsername, setApiUsername] = useState(isEditMode || isDetailMode ? "mixradius.v1.2" : "");
    const [apiPassword, setApiPassword] = useState(isEditMode || isDetailMode ? "12345678" : "");
    const [radiusSecret, setRadiusSecret] = useState(isEditMode || isDetailMode ? "aBcD1234EfGh5678" : "");
    const [dueNoticeUrl, setDueNoticeUrl] = useState(isEditMode || isDetailMode ? "mydomain.com/expired.html" : "");
    const [description, setDescription] = useState(isEditMode || isDetailMode ? "OPVN SERVER" : "");

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-8 pb-6">
                    {/* General Settings Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <RiRouterLine className="size-4 text-blue-500" />
                            <h3 className="text-sm font-semibold">General Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="routerName" className="text-xs font-medium text-muted-foreground">Router Name</Label>
                                <Input
                                    id="routerName"
                                    placeholder="Enter router name (e.g. OPVN CLOUD)"
                                    value={routerName}
                                    onChange={(e) => setRouterName(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="routerAddress" className="text-xs font-medium text-muted-foreground">Router Address (IP/Host)</Label>
                                <Input
                                    id="routerAddress"
                                    placeholder="e.g. 10.108.57.69"
                                    value={routerAddress}
                                    onChange={(e) => setRouterAddress(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeZone" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiTimeLine className="size-3" />
                                Time Zone
                            </Label>
                            {isDetailMode ? (
                                <Input
                                    id="timeZone"
                                    value={timeZone}
                                    disabled
                                />
                            ) : (
                                <Select value={timeZone} onValueChange={setTimeZone}>
                                    <SelectTrigger id="timeZone">
                                        <SelectValue placeholder="Select Time Zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asia/jakarta">(GMT+07:00) Asia/Jakarta</SelectItem>
                                        <SelectItem value="asia/singapore">(GMT+08:00) Asia/Singapore</SelectItem>
                                        <SelectItem value="utc">(GMT+00:00) UTC</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Radius Ports Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiGlobalLine className="size-4 text-purple-500" />
                            <h3 className="text-sm font-semibold">Radius Service Ports</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="authPort" className="text-xs font-medium text-muted-foreground">Authentication Port</Label>
                                <Input
                                    id="authPort"
                                    type="number"
                                    placeholder="1812"
                                    value={authPort}
                                    onChange={(e) => setAuthPort(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accPort" className="text-xs font-medium text-muted-foreground">Accounting Port</Label>
                                <Input
                                    id="accPort"
                                    type="number"
                                    placeholder="1813"
                                    value={accPort}
                                    onChange={(e) => setAccPort(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* API Configuration Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiTerminalLine className="size-4 text-amber-500" />
                            <h3 className="text-sm font-semibold">API Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="apiUsername" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <RiUserSettingsLine className="size-3" />
                                    API Username
                                </Label>
                                <Input
                                    id="apiUsername"
                                    placeholder="Username"
                                    value={apiUsername}
                                    onChange={(e) => setApiUsername(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apiPassword" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <RiKeyLine className="size-3" />
                                    API Password
                                </Label>
                                <Input
                                    id="apiPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={apiPassword}
                                    onChange={(e) => setApiPassword(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apiPort" className="text-xs font-medium text-muted-foreground">API Port</Label>
                                <Input
                                    id="apiPort"
                                    type="number"
                                    placeholder="8728"
                                    value={apiPort}
                                    onChange={(e) => setApiPort(e.target.value)}
                                    disabled={isDetailMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security & URLs Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiShieldKeyholeLine className="size-4 text-emerald-500" />
                            <h3 className="text-sm font-semibold">Security & Advanced</h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="radiusSecret" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiShieldKeyholeLine className="size-3" />
                                Radius Secret
                            </Label>
                            <Input
                                id="radiusSecret"
                                type="password"
                                placeholder="Enter secret key"
                                value={radiusSecret}
                                onChange={(e) => setRadiusSecret(e.target.value)}
                                disabled={isDetailMode}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueNoticeUrl" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiLink className="size-3" />
                                Due Notice URL (Optional)
                            </Label>
                            <Input
                                id="dueNoticeUrl"
                                placeholder="e.g. domain.com/expired.html"
                                value={dueNoticeUrl}
                                onChange={(e) => setDueNoticeUrl(e.target.value)}
                                disabled={isDetailMode}
                            />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <RiInformationLine className="size-4 text-slate-500" />
                            <h3 className="text-sm font-semibold">Additional Info</h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add notes or description for this router..."
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
