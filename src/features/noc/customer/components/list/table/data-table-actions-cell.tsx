import { useRouter } from "next/navigation";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine, RiPrinterLine, RiRefreshLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PPPCustomer } from "../../../types";
import { paths } from "@/config/paths";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export function RenewPrintCell({ row }: { row: Row<PPPCustomer> }) {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-primary hover:text-primary/90 hover:bg-primary/5"
              onClick={() => { }}
            >
              <RiRefreshLine className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Renew</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
              onClick={() => { }}
            >
              <RiPrinterLine className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print invoice/receipt</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function ActionsCell({ row }: { row: Row<PPPCustomer> }) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(paths.dashboard.networkAndOrchestration.customer.edit.getHref(row.original.id));
  };

  const handleDetailClick = () => {
    router.push(paths.dashboard.networkAndOrchestration.customer.detail.getHref(row.original.id));
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" size="icon" variant="ghost">
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
          <RiEditLine />
          Edit
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
