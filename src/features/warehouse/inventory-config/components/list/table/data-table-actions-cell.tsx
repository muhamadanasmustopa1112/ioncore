import { RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { InventoryValuationConfig } from "../../../types";
import { useInventoryConfigStore } from "../../../store/inventory-config";

export function ActionsCell({ row }: { row: Row<InventoryValuationConfig> }) {
  const { openFormSheet, setSelectedConfig } = useInventoryConfigStore();

  return (
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
            setSelectedConfig(row.original);
            openFormSheet("edit");
          }}
        >
          <RiEditLine /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedConfig(row.original);
            openFormSheet("details");
          }}
        >
          <RiEyeLine /> Detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
