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
import type { SuspensionItem } from "../../../types";
import { useSuspensionStore } from "../../../store/suspension";
import { useApproveSuspension } from "../../../api/approve-suspension";
import { useRestoreSuspension } from "../../../api/restore-suspension";

export function ActionsCell({ row }: { row: Row<SuspensionItem> }) {
  const { t } = useTranslation();
  const { setSelectedSuspension, openSuspensionSheet } = useSuspensionStore();

  const { mutate: approveSuspension, isPending: isApproving } =
    useApproveSuspension();

  const { mutate: restoreSuspension, isPending: isRestoring } =
    useRestoreSuspension();

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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSelectedSuspension(row.original);
              openSuspensionSheet("details");
            }}
          >
            <RiEyeLine /> {t("billing.suspension.viewDetail")}
          </DropdownMenuItem>
          {isPending && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setSelectedSuspension(row.original);
                openSuspensionSheet("approve");
              }}
            >
              <RiCheckLine /> {t("billing.suspension.approve")}
            </DropdownMenuItem>
          )}
          {isSuspended && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setSelectedSuspension(row.original);
                openSuspensionSheet("restore");
              }}
            >
              <RiLoopLeftLine /> {t("billing.suspension.restore")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
