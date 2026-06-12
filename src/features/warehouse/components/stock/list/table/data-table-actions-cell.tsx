"use client";

import { RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";

export function ActionsCell({ row }: { row: Row<StockItemResponse> }) {
  const { openStockFormSheet, setSelectedStockItem } = useWarehouseStore();

  const handleReceiveClick = () => {
    setSelectedStockItem(row.original);
    openStockFormSheet("edit");
  };

  const handleDetailClick = () => {
    setSelectedStockItem(row.original);
    openStockFormSheet("details");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleReceiveClick}>
          <RiEditLine />
          Receive Stock
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
