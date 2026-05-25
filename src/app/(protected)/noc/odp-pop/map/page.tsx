"use client";

import { Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useQueryStates, parseAsString } from "nuqs";
import { HierarchicalFilter } from "@/features/noc/odp-pop/components/map/hierarchical-filter";
import { usePop } from "@/features/noc/odp-pop/api/get-pop";

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
    const [filters, setFilters] = useQueryStates({
        area_id: parseAsString,
        pop_id: parseAsString,
        odp_id: parseAsString,
    });

    const popParams = {
        limit: 100,
        page: 1,
        search: filters.area_id ? "" : "", // Search kosong
        area_id: filters.area_id || undefined,
    };

    const { data: popData, isLoading } = usePop({
        params: popParams,
        queryConfig: {
            staleTime: 0, // Selalu fetch fresh data
            gcTime: 0,    // Jangan cache lama
        }
    });

    const handleFilterChange = useCallback(
        (newFilters: { area_id: string | null; pop_id: string | null; odp_id: string | null }) => {
            setFilters(newFilters);
        },
        [setFilters],
    );

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
                popData={popData}
                value={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Map Section */}
            <div className="h-[800px] min-h-[800px] relative" style={{ height: '800px' }}>
                <OdpPopMap
                    data={popData}
                    isLoading={isLoading}
                    selectedArea={filters.area_id}
                    selectedPopId={filters.pop_id}
                    selectedOdpId={filters.odp_id}
                    onSelect={(id) => setFilters(prev => ({ ...prev, pop_id: id, odp_id: null }))}
                />
            </div>
        </div>
    );
}
