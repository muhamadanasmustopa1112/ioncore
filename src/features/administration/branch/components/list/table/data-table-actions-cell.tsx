"use client";

import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BranchData } from "../../../types";
import { useBranchStore } from "../../../store/branch";
import { useDeleteBranch } from "../../../api/branch-queries";

export function ActionsCell({ row }: { row: Row<BranchData> }) {
  const { openBranchFormSheet } = useBranchStore();
  const deleteBranch = useDeleteBranch();
  const branch = row.original;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    deleteBranch.mutate(
      {
        level: branch.level,
        id: branch.id,
        regionalId: branch._regionalId,
        areaId: branch._areaId,
      },
      {
        onSuccess: () => toast.success(`"${branch.name}" deleted`),
      },
    );
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openBranchFormSheet("edit", branch)}
          >
            <RiEditLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openBranchFormSheet("details", branch)}
          >
            <RiEyeLine />
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteBranch.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            <RiDeleteBin7Line />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{branch.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
