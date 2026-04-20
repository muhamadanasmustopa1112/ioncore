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
import { useUpdateUserStatus } from "@/features/user-service/api/users";
import { UserData } from "../../../types";
import { useUserStore } from "../../../store/user";

export function ActionsCell({ row }: { row: Row<UserData> }) {
  const { openUserFormSheet } = useUserStore();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const { id, status } = row.original;
  const isLocked = status === "locked";
  const isActive = status === "active";

  const handleStatusChange = (payload: { is_active?: boolean; is_locked?: boolean }) => {
    updateStatus(
      { id, payload },
      {
        onSuccess: () => toast.success("User status updated"),
        onError: (err: unknown) =>
          toast.error(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to update status",
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
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserFormSheet("details", row.original)}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isActive ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleStatusChange({ is_active: false })}
          >
            <RiUserForbidLine />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleStatusChange({ is_active: true, is_locked: false })}
          >
            <RiUserFollowLine />
            Activate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => handleStatusChange({ is_locked: !isLocked })}
        >
          {isLocked ? <RiLockUnlockLine /> : <RiLockLine />}
          {isLocked ? "Unlock" : "Lock"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
