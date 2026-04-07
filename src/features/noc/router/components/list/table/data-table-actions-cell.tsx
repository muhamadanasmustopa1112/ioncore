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
import { RouterData } from "../../../types";
import { useRouterStore } from "../../../store/router";


export function ActionsCell({ row }: { row: Row<RouterData> }) {

  const { openRouterFormSheet } = useRouterStore();

  const handleEditClick = () => {
    openRouterFormSheet("edit");
  };

  const handleDetailClick = () => {
    console.log("detail");
    openRouterFormSheet("details");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => { }}
        >
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
