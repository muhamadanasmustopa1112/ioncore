"use client";

import { useTranslation } from "react-i18next";
import { RiEditLine, RiEyeLine, RiLockLine, RiLockUnlockLine, RiUserFollowLine, RiUserForbidLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateUserStatus, useRevokeUserSessions } from "@/features/user-service/api/users";
import { UserData } from "../../../types";
import { useUserStore } from "../../../store/user";

export function ActionsCell({ row }: { row: Row<UserData> }) {
  const { t } = useTranslation();
  const { openUserFormSheet } = useUserStore();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const { mutate: revokeSessions } = useRevokeUserSessions();

  const { id, status } = row.original;
  const isLocked = status === "locked";
  const isActive = status === "active";

  const handleStatusChange = (payload: { is_active?: boolean; is_locked?: boolean }) => {
    updateStatus(
      { id, payload },
      {
        onSuccess: () => {
          toast.success(t("administration.users.userStatusUpdated"));
          if (payload.is_active === false) {
            revokeSessions(id, {
              onSuccess: () => toast.info(t("administration.users.sessionsRevoked")),
            });
          }
        },
        onError: (err: unknown) =>
          toast.error(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            t("administration.users.failedToUpdate"),
          ),
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost" disabled={isPending}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserFormSheet("edit", row.original)}>
          <RiEditLine />
          {t("administration.users.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserFormSheet("details", row.original)}>
          <RiEyeLine />
          {t("administration.users.detail")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isActive ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleStatusChange({ is_active: false })}
          >
            <RiUserForbidLine />
            {t("administration.users.deactivate")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleStatusChange({ is_active: true, is_locked: false })}
          >
            <RiUserFollowLine />
            {t("administration.users.activate")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleStatusChange({ is_locked: !isLocked })}
        >
          {isLocked ? <RiLockUnlockLine /> : <RiLockLine />}
          {isLocked ? t("administration.users.unlock") : t("administration.users.lock")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}