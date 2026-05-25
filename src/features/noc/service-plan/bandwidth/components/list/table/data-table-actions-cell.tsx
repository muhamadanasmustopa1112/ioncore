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

import { BandwidthItem } from "../../../types";
import { useBandwidthStore } from "../../../store/bandwidth";
import { useDeleteBandwidth } from "../../../api/delete-bandwidth";

export function ActionsCell({ row }: { row: Row<BandwidthItem> }) {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openBandwidthFormSheet, setSelectedBandwidth } = useBandwidthStore();

  const { mutate: deleteBandwidth, isPending: isDeleting } = useDeleteBandwidth({
    mutationConfig: {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    },
  });

  const handleEditClick = () => {
    setSelectedBandwidth(row.original);
    openBandwidthFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedBandwidth(row.original);
    openBandwidthFormSheet("details");
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (row.original.code) {
      deleteBandwidth({ code: row.original.code });
    }
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
            {t("nocBandwidth.actions.edit", "Edit")}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
            <RiEyeLine />
            {t("nocBandwidth.actions.detail", "Detail")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDeleteClick}
          >
            <RiDeleteBin7Line />
            {t("nocBandwidth.actions.delete", "Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("nocBandwidth.actions.deleteConfirmTitle", "Are you sure?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("nocBandwidth.actions.deleteConfirmDesc", {
                defaultValue: `This will permanently delete the bandwidth plan "${row.original.name}". This action cannot be undone.`,
                name: row.original.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("nocBandwidth.actions.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("nocBandwidth.actions.deleting", "Deleting...") : t("nocBandwidth.actions.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
