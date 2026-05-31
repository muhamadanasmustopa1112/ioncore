import { RiEyeLine } from "@remixicon/react";
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
import type { PaymentItem } from "../../../types";
import { usePaymentStore } from "../../../store/payment";

export function ActionsCell({ row }: { row: Row<PaymentItem> }) {
  const { t } = useTranslation();
  const { openPaymentFormSheet, setSelectedPayment } = usePaymentStore();

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
            setSelectedPayment(row.original);
            openPaymentFormSheet("details");
          }}
        >
          <RiEyeLine /> {t("billing.payment.viewDetail")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
