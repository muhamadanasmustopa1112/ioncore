import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Radio } from "lucide-react";
import { createStatusIcon } from "./map-utils";
import { MutableRefObject, useMemo } from "react";
import { OdpData } from "../../types/odp";

interface OdpMarkersProps {
  data: OdpData[];
  selectedPopId: string | null;
  markerRefs: MutableRefObject<Record<string, L.Marker>>;
}

export function OdpMarkers({ data, selectedPopId, markerRefs }: OdpMarkersProps) {
  // Get ODPs based on drill-down level
  const currentOdps = useMemo(() => {
    // 1. If a specific POP is selected, show ODPs for that POP only
    if (selectedPopId) {
      return data.filter(odp => String(odp.parent_pop_id) === String(selectedPopId));
    }

    // 2. Otherwise return the data as provided (already filtered by area in parent if applicable)
    return data;
  }, [selectedPopId, data]);


  if (currentOdps.length === 0) return null;

  return (
    <>
      {currentOdps.map((odp) => (
        <Marker
          key={`odp-${odp.id}`}
          position={[odp.latitude, odp.longitude]}
          icon={createStatusIcon('odp', true)}
          ref={(ref) => {
            if (ref) markerRefs.current[odp.id] = ref;
          }}
        >
          <Popup className="odp-popup">
            <div className="w-[240px] p-1">
              <div className="flex items-center gap-2 mb-2 border-b pb-2">
                <Radio className="size-3 text-violet-500" />
                <h4 className="font-black text-xs m-0 text-foreground uppercase tracking-tight">{odp.name}</h4>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between border-b border-border/30 pb-1">
                  <span className="text-muted-foreground font-bold uppercase text-[8px]">Port:</span>
                  <span className="font-black">{odp.port || 0}</span>
                </div>
                {odp.olt_name && (
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground font-bold uppercase text-[8px]">OLT:</span>
                    <span className="font-black text-right">{odp.olt_name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold uppercase text-[8px]">Area:</span>
                  <span className="font-black">{odp.area}</span>
                </div>
              </div>

            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
