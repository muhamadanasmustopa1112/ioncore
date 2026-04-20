import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Radio } from "lucide-react";
import { createStatusIcon } from "./map-utils";
import { MutableRefObject, useMemo } from "react";
import { DUMMY_OLT_DETAILS } from "../../data/dummy-olt-details";
import { DUMMY_ODP_LIST } from "../../data/dummy-odp-list";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";

interface OdpMarkersProps {
  selectedArea?: string | null;
  selectedPopId: string | null;
  markerRefs: MutableRefObject<Record<string, L.Marker>>;
}

export function OdpMarkers({ selectedArea, selectedPopId, markerRefs }: OdpMarkersProps) {
  // Get ODPs based on drill-down level
  const currentOdps = useMemo(() => {
    // 1. If a specific POP is selected, show ODPs for that POP only
    if (selectedPopId) {
      const olts = DUMMY_OLT_DETAILS[selectedPopId] || [];
      return olts.flatMap(olt => DUMMY_ODP_LIST[olt.id] || []);
    }

    // 2. If no POP is selected, show ODPs based on Area or Global
    const allOdps = Object.values(DUMMY_ODP_LIST).flat();

    if (selectedArea) {
      // Find all POPs in the selected area
      const popsInArea = DUMMY_POP_DATA.filter(pop => pop.area === selectedArea);
      const popIds = popsInArea.map(p => p.id);

      // Find all OLTs for those POPs
      const oltIdsInArea = popIds.flatMap(popId =>
        (DUMMY_OLT_DETAILS[popId] || []).map(olt => olt.id)
      );

      // Return ODPs for those OLTs
      return allOdps.filter(odp => {
        // We find which OLT this ODP belongs to by checking the DUMMY_ODP_LIST keys
        const oltId = Object.keys(DUMMY_ODP_LIST).find(key =>
          DUMMY_ODP_LIST[key].some(o => o.id === odp.id)
        );
        return oltId && oltIdsInArea.includes(oltId);
      });
    }

    // 3. Global View: Show all ODPs
    return allOdps;
  }, [selectedPopId, selectedArea]);

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
                  <span className="text-muted-foreground font-bold uppercase text-[8px]">PON Port:</span>
                  <span className="font-black">{odp.ponPort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold uppercase text-[8px]">Capacity:</span>
                  <span className="font-black">{odp.portsUsed}/{odp.totalPorts} Ports</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
