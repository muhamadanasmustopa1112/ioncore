import { RiEditLine, RiEyeLine, RiLockLine, RiLockUnlockLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserData } from "../../../types";
import { useUserStore } from "../../../store/user";

export function ActionsCell({ row }: { row: Row<UserData> }) {
  const { openUserFormSheet } = useUserStore();
  const isLocked = row.original.status === "locked";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserFormSheet("edit")}>
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserFormSheet("details")}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => {}}
        >
          {isLocked ? <RiLockUnlockLine /> : <RiLockLine />}
          {isLocked ? "Unlock" : "Lock"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
