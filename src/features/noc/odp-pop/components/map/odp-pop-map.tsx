"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardHeader, CardHeading, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Modular Components
import { PopMarkers } from "./pop-markers";
import { OdpMarkers } from "./odp-markers";
import { TopologyPaths } from "./topology-paths";
import { useOdp } from "../../api/get-odp";
import { useOlt } from "../../api/get-olt";
import { PopResponse } from "../../types/pop";

// --- Controllers ---

/**
 * Handles smooth map pan/zoom and automatic popup opening when selections change.
 */
function MapFocusController({ selectedPopId, selectedOdpId, markerRefs, pops }: {
  selectedPopId: string | null;
  selectedOdpId?: string | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
  pops: any[];
}) {
  const map = useMap();

  useEffect(() => {
    // 1. Handle ODP Selection (Placeholder for now since odps are disabled)
    if (selectedOdpId) {
      // Logic removed as requested
    }
    // 2. Handle POP Selection
    else if (selectedPopId) {

      const pop = pops.find(p => String(p.id) === String(selectedPopId));
      if (pop) {
        map.flyTo([Number(pop.gps_lat), Number(pop.gps_lng)], 16, { animate: true, duration: 1.5 });

        // Auto-open POP popup
        const marker = markerRefs.current[selectedPopId];
        if (marker) {
          setTimeout(() => marker.openPopup(), 1500);
        }
      }
    }
  }, [selectedPopId, selectedOdpId, map, markerRefs, pops]);

  return null;
}



/**
 * Fixes Leaflet "size" calculation issues in flex/dynamic layouts.
 * Includes Firefox-specific fixes with multiple invalidateSize calls.
 */
function MapResizeController() {
  const map = useMap();
  useEffect(() => {
    // Multiple delays for Firefox compatibility
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),
      setTimeout(() => map.invalidateSize(), 300),
      setTimeout(() => map.invalidateSize(), 600),
      setTimeout(() => map.invalidateSize(), 1000),
      setTimeout(() => map.invalidateSize(), 2000),
    ];

    // Handle window resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
}

// --- Main Component ---

interface OdpPopMapProps {
  selectedArea?: string | null;
  selectedPopId: string | null;
  selectedOdpId?: string | null;
  onSelect?: (id: string | null) => void;
  showOdps?: boolean;
  data?: PopResponse;
  isLoading?: boolean;
}

export default function OdpPopMap({
  selectedArea,
  selectedPopId,
  selectedOdpId,
  onSelect,
  showOdps = true,
  data: popResponse,
  isLoading
}: OdpPopMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pops = useMemo(() => popResponse?.data || [], [popResponse]);

  // API already filters by area_id, use data as-is
  const filteredPops = pops;

  const { data: odpResponse } = useOdp({
    params: {
      limit: 100, // Ambil data ODP yang cukup banyak untuk difilter di client
    },
    queryConfig: {
      enabled: !!selectedPopId, // Tetap hanya fetch saat POP dipilih agar hemat resource
    },
  });

  const { data: oltResponse } = useOlt({
    params: {
      limit: 50,
      pop_id: selectedPopId || undefined, // Fetch OLT yang sesuai dengan POP terpilih
    },
  });


  const odps = useMemo(() => odpResponse?.data || [], [odpResponse]);
  const olts = useMemo(() => oltResponse?.data || [], [oltResponse]);

  // Cari daftar ID OLT yang ada di bawah POP yang sedang dipilih
  const selectedPopOltIds = useMemo(() => {
    if (!selectedPopId) return [];
    return olts
      .filter(olt => String(olt.pop_id) === String(selectedPopId) || String(olt.parent_id) === String(selectedPopId))
      .map(olt => String(olt.id));
  }, [olts, selectedPopId]);

  const filteredOdps = useMemo(() => {
    if (!showOdps || !selectedPopId || !olts.length) return [];
    
    // 1. Ambil semua ID OLT yang 'induknya' adalah POP terpilih
    const validOltIds = olts
      .filter(olt => String(olt.pop_id) === String(selectedPopId) || String(olt.parent_id) === String(selectedPopId))
      .map(olt => String(olt.id));

    // 2. Filter ODP yang olt_id-nya ada di dalam daftar OLT valid tadi
    return odps.filter(odp => validOltIds.includes(String(odp.olt_id)));
  }, [odps, olts, showOdps, selectedPopId]);

  // Default center

  const defaultCenter = useMemo<[number, number]>(() => (
    filteredPops.length > 0
      ? [Number(filteredPops[0].gps_lat), Number(filteredPops[0].gps_lng)]
      : [-6.2088, 106.8456]
  ), [filteredPops]);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-muted animate-pulse rounded-3xl flex flex-col items-center justify-center text-muted-foreground font-black text-xs tracking-widest gap-2">
        <span>Initializing Map...</span>
        <span className="text-[10px] font-normal normal-case opacity-70">If map doesn't load, try Ctrl+F5 to hard refresh</span>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-lg border-2 border-border/40 rounded-3xl overflow-hidden relative">
      <CardHeader className="py-5 px-6 border-b bg-card z-10">
        <div className="flex items-center justify-between">
          <CardHeading className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapIcon className="size-4 text-primary" />
            </div>
            Infrastructure Geographic View
          </CardHeading>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-emerald-500" /> Active POP
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-violet-500" /> ODP
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        <MapContainer
          center={defaultCenter}
          zoom={10}
          className="h-full w-full z-0"
          style={{ height: '100%', minHeight: '600px' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            crossOrigin={true}
            eventHandlers={{
              tileerror: (e) => {
                console.warn('Tile load error:', e);
              }
            }}
          />

          <MapResizeController />
          <MapFocusController
            selectedPopId={selectedPopId}
            selectedOdpId={selectedOdpId}
            markerRefs={markerRefs}
            pops={pops}
          />

          <PopMarkers
            data={filteredPops}
            markerRefs={markerRefs}
            onSelect={onSelect}
          />

          {showOdps && (
            <>
              <TopologyPaths
                pops={pops}
                olts={olts}
                odps={filteredOdps}
              />
              <OdpMarkers
                data={filteredOdps}
                selectedPopId={selectedPopId}
                markerRefs={markerRefs}
                onSelect={(id) => onSelect?.(id)}
              />
            </>
          )}
        </MapContainer>

        {selectedPopId && (
          <Button
            variant="outline"
            size="sm"
            mode="icon"
            className="absolute bottom-6 right-6 z-10 bg-background/90 backdrop-blur-xl shadow-2xl border-none hover:bg-background size-10 rounded-xl transition-transform hover:scale-110 active:scale-95"
            onClick={() => onSelect?.(null)}
          >
            <Maximize2 className="size-5 text-primary" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
