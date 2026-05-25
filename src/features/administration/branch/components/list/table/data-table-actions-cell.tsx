"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        onSuccess: () => toast.success(`"${branch.name}" ${t("common.deleted")}`),
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
            {t("common.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openBranchFormSheet("details", branch)}
          >
            <RiEyeLine />
            {t("common.details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteBranch.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            <RiDeleteBin7Line />
            {t("common.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.delete")} {t("menu.branch")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.confirmDeleteMessage", { name: branch.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}