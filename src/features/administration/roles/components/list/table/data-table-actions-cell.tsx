import { RiEditLine, RiEyeLine, RiArchiveLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleData } from "../../../types";
import { useRoleStore } from "../../../store/role";

export function ActionsCell({ row }: { row: Row<RoleData> }) {
  const { openRoleDialog } = useRoleStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openRoleDialog("edit", row.original)}>
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openRoleDialog("details", row.original)}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        {!row.original.isSystem && (
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => {}}>
            <RiArchiveLine />
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
