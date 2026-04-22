"use client";

import { Suspense, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ScreenLoader } from "@/components/common/screen-loader";
import { HierarchicalFilter } from "@/features/noc/odp-pop/components/map/hierarchical-filter";

// Dynamically import the map component with SSR disabled
const OdpPopMap = dynamic(
    () => import("@/features/noc/odp-pop/components/map/odp-pop-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full min-h-[800px] w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground uppercase font-black text-xs tracking-widest shadow-inner">
                Loading Map Data...
            </div>
        )
    }
);

export default function Page() {
    const [filters, setFilters] = useState<{
        area: string | null;
        popId: string | null;
        odpId: string | null;
    }>({
        area: null,
        popId: null,
        odpId: null,
    });

    const handleFilterChange = useCallback((newFilters: {
        area: string | null;
        popId: string | null;
        odpId: string | null;
    }) => {
        setFilters(newFilters);
    }, []);

    return (
        <div className="flex flex-col gap-6 p-6 h-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black uppercase tracking-widest text-foreground">Infrastructure Map</h1>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">
                    Monitor and manage ODP & POP locations across regions
                </p>
            </div>

            {/* Filter Section */}
            <HierarchicalFilter
                onFilterChange={handleFilterChange}
            />

            {/* Map Section */}
            <div className="h-[800px] flex-none">
                <OdpPopMap
                    selectedArea={filters.area}
                    selectedPopId={filters.popId}
                    selectedOdpId={filters.odpId}
                    onSelect={(id) => setFilters(prev => ({ ...prev, popId: id, odpId: null }))}
                />
            </div>
        </div>
    );
}
