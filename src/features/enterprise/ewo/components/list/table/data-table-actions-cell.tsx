"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { paths } from "@/config/paths";
import type { Ewo } from "../../../types/ewo";
import { useEwoStore } from "../../../store/ewo";
import { useDeleteEwo } from "../../../api/delete-ewo";

export function ActionsCell({ row }: { row: Row<Ewo> }) {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedItem } = useEwoStore();
  const { mutate: deleteEwo, isPending: isDeleting } = useDeleteEwo();
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(paths.dashboard.enterprise.ewo.detail.getHref(row.original.id))}
          >
            <Eye className="size-4" /> {t("common.detail", "Detail")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedItem(row.original);
              openFormSheet("edit");
            }}
          >
            <Pencil className="size-4" /> {t("common.edit", "Edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" /> {t("common.delete", "Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure", "Are you sure?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("enterprise.ewo.deleteConfirm", { name: row.original.ewo_number, defaultValue: `This will permanently delete "${row.original.ewo_number}". This action cannot be undone.` })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEwo(row.original.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("common.deleting", "Deleting...") : t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
