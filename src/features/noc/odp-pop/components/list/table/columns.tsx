"use client";

import { useState, useEffect, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import { ActionsCellOdp } from "./data-table-actions-odp";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PopData } from "../../../types/pop";

// Cache sederhana di luar komponen agar tidak fetch ulang koordinat yang sama
const addressCache: Record<string, string> = {};

const AddressCell = ({ lat, lng, fallback }: { lat: any, lng: any, fallback?: string }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Gunakan IntersectionObserver agar hanya fetch yang terlihat di layar saja
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFetch || !lat || !lng) return;

    const cacheKey = `${lat},${lng}`;
    if (addressCache[cacheKey]) {
      setAddress(addressCache[cacheKey]);
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
          { headers: { "User-Agent": "ION-App" } }
        );
        const data = await res.json();
        const result = data.display_name || "";
        addressCache[cacheKey] = result;
        setAddress(result);
      } catch (e) {
        console.error("Geocoding error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [shouldFetch, lat, lng]);

  return (
    <div ref={containerRef} className="min-h-[20px]">
      {loading ? (
        <div className="animate-pulse h-3 w-32 bg-muted rounded" />
      ) : (
        <div
          className="text-foreground/80  truncate max-w-[200px]"
          title={address || fallback}
        >
          {address || fallback || "-"}
        </div>
      )}
    </div>
  );
};

export const getPopColumns = (type: 'pop' | 'odp' = 'pop'): ColumnDef<PopData>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} className="text-foreground" />
    ),
    cell: ({ row, table }) => (
      <div
        className="flex flex-col gap-1 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => (table.options.meta as any)?.onPopSelect(row.original.id)}
      >
        <span className="font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
          {row.original.name}
        </span>
      </div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataGridColumnHeader title="Code" column={column} className="text-foreground" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80">
        {getValue() as string || "-"}
      </div>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <DataGridColumnHeader title="Area" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <div className="text-foreground/80">
        {row.original.area}
      </div>
    ),
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataGridColumnHeader title="Address" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => (
      <AddressCell
        lat={row.original.gps_lat}
        lng={row.original.gps_lng}
        fallback={row.original.address}
      />
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "gps_lat",
    header: ({ column }) => (
      <DataGridColumnHeader title="Latitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80 font-mono text-xs">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "gps_lng",
    header: ({ column }) => (
      <DataGridColumnHeader title="Longitude" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => (
      <div className="text-foreground/80 font-mono text-xs">
        {getValue() as number}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ getValue }) => {
      const status = (getValue() as string || "UNKNOWN").toUpperCase();
      let variant: any = "secondary";
      
      if (status === "UP") variant = "success";
      if (status === "DOWN") variant = "destructive";
      if (status === "DEGRADED") variant = "warning";

      return (
        <Badge variant={variant} appearance="light" shape="circle" className="px-2 font-semibold uppercase">
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    size: 100,
  },
  {
    id: "actions",
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => type === 'odp' ? <ActionsCellOdp row={row} /> : <ActionsCell row={row} />,
    enableSorting: false,
    size: 50,
  },
];
