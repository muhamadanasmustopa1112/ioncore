"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { PopData } from "../../types/pop";
import { OdpData } from "../../types/odp";
import { OltData } from "../../types/olt";


interface TopologyPathsProps {
  pops: PopData[];
  olts: OltData[];
  odps: OdpData[];
}

/**
 * Renders topology paths (connection lines) between POPs and their child ODPs.
 * This visualizes the physical/logical connection between infrastructure points.
 */
export function TopologyPaths({ pops, olts, odps }: TopologyPathsProps) {
  const paths = useMemo(() => {
    const result: { id: string; positions: [number, number][] }[] = [];

    // ODPs are already filtered by the parent (OdpPopMap)
    const odpsToProcess = odps;

    // Build paths by finding the bridge OLT then its parent POP location for each ODP
    const processedOlts = new Set<string>();

    odpsToProcess.forEach(odp => {
      // 1. Find the OLT that this ODP belongs to
      const olt = olts.find(o => String(o.id) === String(odp.olt_id));

      if (olt) {
        // Path A: ODP to OLT
        result.push({
          id: `path-odp-${odp.id}-to-olt-${olt.id}`,
          positions: [
            [odp.gps_lat, odp.gps_lng],
            [olt.gps_lat, olt.gps_lng]
          ]
        });

        // Path B: OLT to POP (only draw once per OLT)
        if (!processedOlts.has(olt.id)) {
          const pop = pops.find(p => String(p.id) === String(olt.pop_id) || String(p.id) === String(olt.parent_id));
          if (pop) {
            result.push({
              id: `path-olt-${olt.id}-to-pop-${pop.id}`,
              positions: [
                [olt.gps_lat, olt.gps_lng],
                [pop.gps_lat, pop.gps_lng]
              ]
            });
            processedOlts.add(olt.id);
          } else {
            console.warn(`DEBUG Topology: OLT ${olt.id} has no matching POP (pop_id: ${olt.pop_id})`);
          }
        }
      } else {
        console.warn(`DEBUG Topology: ODP ${odp.id} has no matching OLT (olt_id: ${odp.olt_id})`);
      }
    });

    console.log(`DEBUG Topology: Created ${result.length} path segments from ${odpsToProcess.length} ODPs`);

    return result;
  }, [pops, olts, odps]);


  return (
    <>
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.positions}
          pathOptions={{
            color: "#a78bfa",
            weight: 5,
            opacity: 0.8,
            dashArray: "10, 12",
            lineCap: "round",
            interactive: false
          }}
        />
      ))}
    </>
  );
}
