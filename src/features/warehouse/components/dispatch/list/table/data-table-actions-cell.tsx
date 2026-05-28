"use client";

import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DispatchRecord } from "@/features/warehouse/types";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";


export function ActionsCell({ row }: { row: Row<DispatchRecord> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openDispatchFormSheet, setSelectedDispatch } = useWarehouseStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost"><EllipsisVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedDispatch(row.original); openDispatchFormSheet("edit"); }}>
            <RiEditLine /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedDispatch(row.original); openDispatchFormSheet("details"); }}>
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
            <AlertDialogDescription>This will permanently delete dispatch for &quot;{row.original.woNumber}&quot;. This action cannot be undone.</AlertDialogDescription>
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
