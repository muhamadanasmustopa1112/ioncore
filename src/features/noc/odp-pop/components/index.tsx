"use client";

import { useMemo, useState } from "react";
import { RiAddLine, RiInformationLine } from "@remixicon/react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
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
import { OdpPopKpiCards } from "./odp-pop-kpi-cards";
import { OdpPopList } from "./list/odp-pop-list";
import { OdpPopMapWrapper } from "./map/odp-pop-map-wrapper";
import { usePopStore } from "../store/pop";
import { PopFormSheet } from "./form/pop-form-sheet";
import { usePop } from "../api/get-pop";

export function OdpPopManagePage() {
    const { openPopFormSheet } = usePopStore();

    const [selectedPopId, setSelectedPopId] = useState<string | null>(null);

    const [filter, setFilter] = useQueryStates({
        limit: parseAsInteger.withDefault(100),
        page: parseAsInteger.withDefault(1),
        search: parseAsString,
        sort_by: parseAsString.withDefault("name"),
        sort_order: parseAsString.withDefault("asc"),
    });

    const params = useMemo(() => ({
        limit: filter.limit,
        page: filter.page,
        search: filter.search || "",
        sort_by: filter.sort_by,
        sort_order: filter.sort_order,
    }), [filter]);

    const { data: popData, isLoading } = usePop({ params });

    return (
        <div className="relative h-full w-full flex flex-col overflow-hidden px-6 py-3">
            <PageBreadcrumb
                items={[
                    {
                        title: "Network & Orchestration",
                        path: paths.dashboard.networkAndOrchestration.root.getHref(),
                    },
                    { title: "ODP & POP" },
                    { title: "Manage" },
                ]}
                className="mb-2"
            />
            <Toolbar className="mt-2 items-center flex-none">
                <ToolbarHeading className="gap-0">
                    <ToolbarTitle className="text-2xl font-extrabold tracking-tight">POP Management Dashboard</ToolbarTitle>
                    <div className="mt-2 flex items-center gap-2.5 text-sm font-medium">
                        <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
                            <RiInformationLine className="size-3.5" />
                            Live Capacity Data
                        </Badge>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground font-normal">Real-time infrastructure health monitoring</span>
                    </div>
                </ToolbarHeading>
                <ToolbarActions>
                    <Button
                        variant="primary"
                        className="h-11 px-6 font-semibold shadow-md"
                        onClick={() => openPopFormSheet("new")}
                    >
                        <RiAddLine className="size-5" />
                        Add New POP
                    </Button>
                </ToolbarActions>
            </Toolbar>

            <div className="mt-4 flex-none">
                <OdpPopKpiCards data={popData} />
            </div>

            <div className="flex-1 flex flex-col gap-6 mt-4 min-h-0 overflow-hidden">
                {/* Top Section: Interactive Map */}
                <div className="h-[500px] flex-none shadow-sm rounded-xl overflow-hidden border border-border/50">
                    <OdpPopMapWrapper 
                        selectedPopId={selectedPopId} 
                        onSelect={setSelectedPopId}
                        data={popData}
                        isLoading={isLoading}
                    />
                </div>

                {/* Bottom Section: Data Table */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <OdpPopList 
                        onPopSelect={setSelectedPopId} 
                        data={popData}
                        isLoading={isLoading}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>
            </div>

            <PopFormSheet />
        </div>
    );
}
