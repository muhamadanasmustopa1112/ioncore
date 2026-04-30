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
 * Direct path from ODP to its parent POP through OLT relation.
 */
export function TopologyPaths({ pops, olts, odps }: TopologyPathsProps) {
  const paths = useMemo(() => {
    const result: { id: string; positions: [number, number][] }[] = [];

    odps.forEach(odp => {
      // 1. Cari OLT-nya
      const olt = olts.find(o => String(o.id) === String(odp.olt_id));
      
      if (olt) {
        // 2. Cari POP-nya berdasarkan relasi di OLT
        const pop = pops.find(p => String(p.id) === String(olt.pop_id) || String(p.id) === String(olt.parent_id));
        
        // 3. Tarik garis langsung ODP -> POP jika koordinat keduanya ada
        if (pop && odp.gps_lat && odp.gps_lng && pop.gps_lat && pop.gps_lng) {
          result.push({
            id: `path-odp-${odp.id}-to-pop-${pop.id}`,
            positions: [
              [Number(odp.gps_lat), Number(odp.gps_lng)],
              [Number(pop.gps_lat), Number(pop.gps_lng)]
            ]
          });
        }
      }
    });

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
            weight: 4,
            opacity: 0.7,
            dashArray: "10, 12",
            lineCap: "round",
            interactive: false
          }}
        />
      ))}
    </>
  );
}
