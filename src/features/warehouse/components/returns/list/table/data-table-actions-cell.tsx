"use client";

import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { ReturnsListItem } from "@/features/warehouse/types/returns";
import { toDeviceReturnRecord } from "@/features/warehouse/types/returns";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";

export function ActionsCell({ row }: { row: Row<ReturnsListItem> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openReturnFormSheet, setSelectedReturn } = useWarehouseStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost"><EllipsisVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedReturn(toDeviceReturnRecord(row.original)); openReturnFormSheet("edit"); }}>
            <RiEditLine /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedReturn(toDeviceReturnRecord(row.original)); openReturnFormSheet("details"); }}>
            <RiEyeLine /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <RiDeleteBin7Line /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete return record &quot;{row.original.id}&quot;. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowDeleteDialog(false)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
