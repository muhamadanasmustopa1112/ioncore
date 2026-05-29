"use client";

import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMaintenanceStore } from "../../../store/maintenance";
import type { MaintenanceEvent } from "../../../types";

export function ActionsCell({ row }: { row: Row<MaintenanceEvent> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedMaintenance } = useMaintenanceStore();

  const handleEditClick = () => {
    setSelectedMaintenance(row.original);
    openFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedMaintenance(row.original);
    openFormSheet("details");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
            <RiEditLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
            <RiEyeLine />
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <RiDeleteBin7Line />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{row.original.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setShowDeleteDialog(false)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
