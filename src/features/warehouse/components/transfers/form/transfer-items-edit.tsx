"use client";

import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EditTransferFormValues } from "./transfer-form-schemas";

interface TransferItemsEditProps {
  fields: FieldArrayWithId<EditTransferFormValues, "items", "id">[];
  register: UseFormRegister<EditTransferFormValues>;
  errors: FieldErrors<EditTransferFormValues>;
  showReceivedQty: boolean;
}

export function TransferItemsEdit({
  fields,
  register,
  errors,
  showReceivedQty,
}: TransferItemsEditProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Package className="size-4 text-muted-foreground" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.transferItems", "Transfer Items")}
        </span>
      </div>

      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase">
                {t("warehouse.itemName", "Item")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase">
                {t("warehouse.quantity", "Qty")}
              </TableHead>
              {showReceivedQty && (
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.receivedQty", "Received Qty")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="align-top py-3">
                  <div className="text-xs font-medium">{field.stockItemName}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {field.stockItemSku}
                  </div>
                  <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
                    {field.itemType} · {field.uom}
                  </div>
                </TableCell>
                <TableCell className="align-top py-3">
                  <Input
                    type="number"
                    min={1}
                    step="any"
                    {...register(`items.${index}.qty`, { valueAsNumber: true })}
                    className="text-xs h-9 w-24"
                  />
                  {errors.items?.[index]?.qty && (
                    <p className="text-[10px] text-destructive font-bold mt-1">
                      {errors.items[index]?.qty?.message}
                    </p>
                  )}
                </TableCell>
                {showReceivedQty && (
                  <TableCell className="align-top py-3">
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      {...register(`items.${index}.receivedQty`, {
                        valueAsNumber: true,
                      })}
                      className="text-xs h-9 w-24"
                    />
                    {errors.items?.[index]?.receivedQty && (
                      <p className="text-[10px] text-destructive font-bold mt-1">
                        {errors.items[index]?.receivedQty?.message}
                      </p>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {fields.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={showReceivedQty ? 3 : 2}
                  className="text-center text-xs text-muted-foreground py-6"
                >
                  {t("warehouse.noTransferItems", "No items.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {errors.items?.root && (
        <p className="text-[10px] text-destructive font-bold">
          {errors.items.root.message}
        </p>
      )}
    </div>
  );
}
