import { useState } from "react";
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiEyeLine,
} from "@remixicon/react";
import { type Row } from "@tanstack/react-table";
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
import type { BulkOperationItem } from "../../../types";

export function ActionsCell({ row }: { row: Row<BulkOperationItem> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            onClick={() => {
              /* open detail */
            }}
          >
            <RiEyeLine /> View Details
          </DropdownMenuItem>
          {row.original.status === "draft" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                /* open edit */
              }}
            >
              <RiEditLine /> Edit
            </DropdownMenuItem>
          )}
          {["draft", "failed"].includes(row.original.status) && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setShowDeleteDialog(true)}
            >
              <RiDeleteBin7Line /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the bulk operation &quot;{row.original.description}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                /* delete operation */
                setShowDeleteDialog(false);
              }}
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
