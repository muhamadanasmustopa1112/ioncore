import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { ProfileGroupItem } from "../../../types";
import { useProfileGroupStore } from "../../../store/profile-group";
import { useDeleteProfileGroup } from "../../../api/delete-profile-group";

export function ActionsCell({ row }: { row: Row<ProfileGroupItem> }) {
  const { t } = useTranslation();
  const { openProfileGroupFormSheet, setSelectedProfileGroup } = useProfileGroupStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteProfileGroup, isPending: isDeleting } = useDeleteProfileGroup();

  const handleEditClick = () => {
    setSelectedProfileGroup(row.original);
    openProfileGroupFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedProfileGroup(row.original);
    openProfileGroupFormSheet("details");
  };

  const handleDeleteConfirm = () => {
    deleteProfileGroup(row.original.code);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost" disabled={isDeleting}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
            <RiEyeLine />
            {t("nocProfileGroup.actions.detail", "Detail")}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
            <RiEditLine />
            {t("nocProfileGroup.actions.edit", "Edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <RiDeleteBin7Line />
            {t("nocProfileGroup.actions.delete", "Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("nocProfileGroup.actions.deleteConfirmTitle", "Are you absolutely sure?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("nocProfileGroup.actions.deleteConfirmDesc", {
                defaultValue: `This action cannot be undone. This will permanently delete the profile group "${row.original.name}" and remove it from our servers.`,
                name: row.original.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("nocProfileGroup.actions.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? t("nocProfileGroup.actions.deleting", "Deleting...") : t("nocProfileGroup.actions.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
