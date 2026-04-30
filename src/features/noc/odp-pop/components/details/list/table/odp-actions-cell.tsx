"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
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
import { paths } from "@/config/paths";
import { OdpData } from "@/features/noc/odp-pop/types/odp";
import { useOdpStore } from "@/features/noc/odp-pop/store/odp";
import { useDeleteOdp } from "@/features/noc/odp-pop/api/delete-odp";

export function OdpActionsCell({ row }: { row: Row<OdpData> }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openOdpFormSheet, setSelectedOdp } = useOdpStore();

  const { mutate: deleteOdp, isPending: isDeleting } = useDeleteOdp({
    mutationConfig: {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    },
  });

  const handleEditClick = () => {
    setSelectedOdp(row.original);
    openOdpFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedOdp(row.original);
    openOdpFormSheet("details");
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (row.original.id) {
      deleteOdp({ id: String(row.original.id) });
    }
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8" size="icon" variant="ghost">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
            <RiEyeLine />
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
            <RiEditLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDeleteClick}
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
              This will permanently delete the ODP "{row.original.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
