"use client";

import { RiAddLine, RiDownloadLine, RiInformationLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Toolbar,
    ToolbarActions,
    ToolbarHeading,
    ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { BandwidthList } from "./list/bandwidth-list";
import { useBandwidthStore } from "../store/bandwidth";
import { BandwidthFormSheet } from "./form/bandwidth-form-sheet";

export function BandwidthListPage() {
    const { openBandwidthFormSheet } = useBandwidthStore();

    return (
        <div className="relative h-full w-full overflow-hidden px-6 py-3">
            <PageBreadcrumb
                items={[
                    {
                        title: "Network & Orchestration",
                        path: paths.dashboard.networkAndOrchestration.root.getHref(),
                    },
                    { title: "ION Radius" },
                    { title: "Service Plan" },
                    { title: "Bandwidth" },
                ]}
                className="mb-15"
            />
            <Toolbar className="mt-5 items-center">
                <ToolbarHeading>
                    <ToolbarTitle className="text-2xl font-extrabold tracking-tight">Bandwidth</ToolbarTitle>
                    <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
                        <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
                            <RiInformationLine className="size-3.5" />
                            Refresh Table: 1m
                        </Badge>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground font-normal">Ping check every 5 minutes by system</span>
                    </div>
                </ToolbarHeading>
                <ToolbarActions>
                    <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
                        <RiDownloadLine className="size-4" />
                        Export Data
                    </Button>
                    <Button
                        variant="primary"
                        className="h-11 px-6 font-semibold shadow-md"
                        onClick={() => openBandwidthFormSheet("new")}
                    >
                        <RiAddLine className="size-5" />
                        Add New Bandwidth
                    </Button>
                </ToolbarActions>
            </Toolbar>

            <div className="flex-1 overflow-auto mt-4">
                <BandwidthList />
            </div>

            <BandwidthFormSheet />
        </div>
    );
}
