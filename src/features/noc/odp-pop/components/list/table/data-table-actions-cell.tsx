import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { PopData } from "../../../types/pop";
import { usePopStore } from "../../../store/pop";
import { useDeletePop } from "../../../api/delete-pop";

export function ActionsCell({ row }: { row: Row<PopData> }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openPopFormSheet, setSelectedPop } = usePopStore();

  const { mutate: deletePop, isPending: isDeleting } = useDeletePop({
    mutationConfig: {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    },
  });

  const handleEditClick = () => {
    setSelectedPop(row.original);
    openPopFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedPop(row.original);
    router.push(`${paths.dashboard.networkAndOrchestration.odpPop.manage.detail.getHref(String(row.original.id))}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (row.original.id) {
      deletePop({ id: String(row.original.id) });
    }
  };

  return (
    <>
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
              This will permanently delete the POP "{row.original.name}". This action cannot be undone.
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
    </>
  );
}


