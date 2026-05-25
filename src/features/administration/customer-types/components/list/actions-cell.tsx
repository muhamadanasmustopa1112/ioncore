"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { RiEditLine, RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { CustomerType } from "../../types";

interface Props {
  row: Row<CustomerType>;
  onEdit: (row: CustomerType) => void;
  onDelete: (id: string) => void;
}

export function ActionsCell({ row, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(row.original)}>
            <RiEditLine />
            {t("administration.customerTypesPage.actionEdit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setConfirmOpen(true)}
          >
            <RiDeleteBinLine />
            {t("administration.customerTypesPage.actionDelete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.customerTypesPage.deleteTitle")} &quot;{row.original.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("administration.customerTypesPage.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("administration.customerTypesPage.deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onDelete(row.original.id); setConfirmOpen(false); }}
            >
              {t("administration.customerTypesPage.deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
