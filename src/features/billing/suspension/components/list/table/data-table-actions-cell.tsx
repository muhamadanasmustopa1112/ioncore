import { useState } from "react";
import { RiCheckLine, RiEyeLine, RiLoopLeftLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import type { SuspensionItem } from "../../../types";
import { useSuspensionStore } from "../../../store/suspension";

export function ActionsCell({ row }: { row: Row<SuspensionItem> }) {
  const { t } = useTranslation();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const { setSelectedSuspension } = useSuspensionStore();

  const isPending = row.original.status === "pending";
  const isSuspended = row.original.status === "suspended";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          {isPending && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setShowApproveDialog(true)}
            >
              <RiCheckLine /> {t("billing.suspension.approve")}
            </DropdownMenuItem>
          )}
          {isSuspended && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setShowRestoreDialog(true)}
            >
              <RiLoopLeftLine /> {t("billing.suspension.restore")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedSuspension(row.original);
            }}
          >
            <RiEyeLine /> {t("billing.suspension.viewDetail")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("billing.suspension.approveTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("billing.suspension.approveDescription", {
                customer: row.original.customerName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("billing.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // TODO: wire to approve mutation
                setShowApproveDialog(false);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("billing.suspension.approve")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("billing.suspension.restoreTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("billing.suspension.restoreDescription", {
                customer: row.original.customerName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("billing.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // TODO: wire to restore mutation
                setShowRestoreDialog(false);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("billing.suspension.restore")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
