"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiMapPinLine, RiPencilLine, RiAddLine, RiSignalTowerLine } from "@remixicon/react";
import { PopData } from "../../../types/pop";
import { useProvisioningStore } from "../../../store/provisioning";
import { ProvisionDeviceFormSheet } from "../../form/provision-device-form-sheet";

export function PopDetailHeader({ pop }: { pop: PopData }) {
  const { openProvisioningSheet } = useProvisioningStore();

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between p-6 bg-card rounded-2xl shadow-sm border border-border/50">
      <div className="flex items-center gap-5">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/20">
          <RiSignalTowerLine className="size-10" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              {pop.name}
            </h1>
            <Badge
              variant={'success'}
              appearance="light"
              className="px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            >
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <RiMapPinLine className="size-4" />
            <span className="text-sm">{pop?.address}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button variant="outline" className="h-11 px-6 font-bold gap-2 hover:bg-muted/50 border-2">
          <RiPencilLine className="size-5 text-muted-foreground" />
          Edit Details
        </Button>
        <Button
          className="h-11 px-8 font-bold gap-2 bg-primary hover:bg-primary/80 shadow-md"
          onClick={openProvisioningSheet}
        >
          <RiAddLine className="size-5" />
          Provision Device
        </Button>
      </div>

      <ProvisionDeviceFormSheet />
    </div>
  );
}
