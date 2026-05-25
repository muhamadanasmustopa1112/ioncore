"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
          <TooltipContent>{t("nocCustomer.actions.renew", "Renew")}</TooltipContent>
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
          <TooltipContent>{t("nocCustomer.actions.printInvoice", "Print invoice/receipt")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function ActionsCell({ row }: { row: Row<PPPCustomer> }) {
  const router = useRouter();
  const { t } = useTranslation();

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
          {t("nocCustomer.actions.detail", "Detail")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
          <RiEditLine />
          {t("nocCustomer.actions.edit", "Edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => { }}
        >
          <RiDeleteBin7Line />
          {t("nocCustomer.actions.delete", "Delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
