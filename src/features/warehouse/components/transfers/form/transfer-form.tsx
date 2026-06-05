"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Package, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransferDetail } from "@/features/warehouse/api/get-transfers";
import { useCreateTransfer } from "@/features/warehouse/api/post-transfer";
import { useUpdateTransferStatus } from "@/features/warehouse/api/post-transfer-status";
import { useStockItems } from "@/features/warehouse/api/get-stock-items";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { useAuthStore } from "@/store/auth-store";
import {
  buildCreateTransferPayload,
  generateTransferNumber,
} from "@/features/warehouse/utils/build-transfer-payload";
import { buildTransferStatusPayload } from "@/features/warehouse/utils/build-transfer-status-payload";
import { TransferDetailView } from "./transfer-detail-view";
import { TransferItemsEdit } from "./transfer-items-edit";
import {
  editTransferSchema,
  newTransferSchema,
  TRANSFER_STATUS_OPTIONS,
  type EditTransferFormValues,
  type NewTransferFormValues,
} from "./transfer-form-schemas";

export type { EditTransferFormValues, NewTransferFormValues };

export interface TransferFormRef {
  submit: () => void;
  isPending: boolean;
}

interface TransferFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

const selectClassName =
  "flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TransferFormLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {t("common.loading", "Loading...")}
    </div>
  );
}

function TransferFormError() {
  const { t } = useTranslation();

  return (
    <div className="px-1 py-8 text-sm text-destructive text-center">
      {t("warehouse.transferLoadError", "Failed to load transfer details.")}
    </div>
  );
}

const NewTransferForm = forwardRef<
  TransferFormRef,
  { onSuccess: () => void }
>(({ onSuccess }, ref) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { data: stockItemsResponse, isLoading: isStockItemsLoading } =
    useStockItems();
  const stockItems = stockItemsResponse?.data ?? [];
  const { mutate: createTransfer, isPending } = useCreateTransfer({
    mutationConfig: { onSuccess: () => onSuccess() },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewTransferFormValues>({
    resolver: zodResolver(newTransferSchema),
    defaultValues: {
      transfer_number: generateTransferNumber(),
      requested_by: user?.id ?? "",
      source_warehouse_id: 1,
      target_warehouse_id: 2,
      items: [{ stock_item_id: 0, quantity: 1 }],
    },
  });

  useEffect(() => {
    if (user?.id) {
      setValue("requested_by", user.id);
    }
  }, [user?.id, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
    isPending,
  }));

  function onSubmit(values: NewTransferFormValues) {
    createTransfer(
      buildCreateTransferPayload({
        ...values,
        requested_by: values.requested_by || user?.id || "",
      })
    );
  }

  if (isStockItemsLoading) {
    return <TransferFormLoading />;
  }

  return (
    <div className="space-y-5 px-1 py-2 pb-6">
      <input type="hidden" {...register("requested_by")} />

      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.transferNumber", "Transfer Number")} *
        </label>
        <Input
          {...register("transfer_number")}
          className="text-xs h-10 font-mono"
        />
        {errors.transfer_number && (
          <p className="text-[10px] text-destructive font-bold">
            {errors.transfer_number.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.sourceWarehouse", "Source Warehouse")} *
          </label>
          <select
            {...register("source_warehouse_id", { valueAsNumber: true })}
            className={selectClassName}
          >
            {WAREHOUSE_OPTIONS.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
          {errors.source_warehouse_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.source_warehouse_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.destinationWarehouse", "Destination Warehouse")} *
          </label>
          <select
            {...register("target_warehouse_id", { valueAsNumber: true })}
            className={selectClassName}
          >
            {WAREHOUSE_OPTIONS.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
          {errors.target_warehouse_id && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.target_warehouse_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.transferItems", "Transfer Items")} *
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[11px] font-semibold"
            onClick={() => append({ stock_item_id: 0, quantity: 1 })}
          >
            <Plus className="size-3.5 mr-1.5" />
            {t("warehouse.addItem", "Add Item")}
          </Button>
        </div>

        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.itemDetails", "Item")}
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase">
                  {t("warehouse.quantity", "Qty")}
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="align-top py-3">
                    <select
                      {...register(`items.${index}.stock_item_id`, {
                        valueAsNumber: true,
                      })}
                      className={selectClassName}
                    >
                      <option value={0}>
                        {t("warehouse.selectStockItem", "Select item...")}
                      </option>
                      {stockItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku})
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.stock_item_id && (
                      <p className="text-[10px] text-destructive font-bold mt-1">
                        {errors.items[index]?.stock_item_id?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <Input
                      type="number"
                      min={1}
                      step="any"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="text-xs h-9 w-24"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-[10px] text-destructive font-bold mt-1">
                        {errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="align-top py-3">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        mode="icon"
                        className="size-8 text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {errors.items?.root && (
          <p className="text-[10px] text-destructive font-bold">
            {errors.items.root.message}
          </p>
        )}
      </div>
    </div>
  );
});

NewTransferForm.displayName = "NewTransferForm";

const TransferEditForm = forwardRef<
  TransferFormRef,
  { transferId: string; onSuccess: () => void }
>(({ transferId, onSuccess }, ref) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useTransferDetail({
    id: transferId,
    queryConfig: { enabled: !!transferId },
  });
  const { mutate: updateStatus, isPending } = useUpdateTransferStatus({
    mutationConfig: { onSuccess: () => onSuccess() },
  });

  const transfer = data?.data;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditTransferFormValues>({
    resolver: zodResolver(editTransferSchema),
    defaultValues: {
      status: "pending",
      notes: "",
      items: [],
    },
  });

  const { fields } = useFieldArray({ control, name: "items" });
  const status = watch("status");
  const showReceivedQty = status === "received";

  useEffect(() => {
    if (transfer) {
      reset({
        status: transfer.status,
        notes: transfer.notes ?? "",
        items: transfer.items.map((item) => ({
          id: item.id,
          stockItemId: item.stockItemId,
          stockItemName: item.stockItemName,
          stockItemSku: item.stockItemSku,
          itemType: item.itemType,
          uom: item.uom,
          qty: item.qty,
          receivedQty: item.qty,
        })),
      });
    }
  }, [transfer, reset]);

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
    isPending,
  }));

  function onSubmit(values: EditTransferFormValues) {
    const { id, payload } = buildTransferStatusPayload(transferId, values);
    updateStatus({ id, payload });
  }

  if (isLoading) return <TransferFormLoading />;
  if (isError || !transfer) return <TransferFormError />;

  return (
    <div className="space-y-5 px-1 py-2 pb-6">
      <div className="space-y-1">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.transferId", "Transfer ID")}
        </p>
        <p className="text-sm font-mono">{transfer.id}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.sourceWarehouse", "Source Warehouse")}
          </p>
          <Input
            readOnly
            value={transfer.sourceWarehouseName}
            className="text-xs h-10 bg-muted/40"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.destinationWarehouse", "Destination Warehouse")}
          </p>
          <Input
            readOnly
            value={transfer.destinationWarehouseName}
            className="text-xs h-10 bg-muted/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("common.status", "Status")} *
          </label>
          <select
            {...register("status")}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {TRANSFER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-[10px] text-destructive font-bold">
              {errors.status.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.initiatedBy", "Initiated By")}
          </p>
          <Input
            readOnly
            value={transfer.initiatedByName}
            className="text-xs h-10 bg-muted/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.dateInitiated", "Date Initiated")}
          </p>
          <Input
            readOnly
            value={formatDate(transfer.dateInitiated)}
            className="text-xs h-10 bg-muted/40"
          />
        </div>
        {transfer.dateDispatched && (
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.dateDispatched", "Date Dispatched")}
            </p>
            <Input
              readOnly
              value={formatDate(transfer.dateDispatched)}
              className="text-xs h-10 bg-muted/40"
            />
          </div>
        )}
      </div>

      <TransferItemsEdit
        fields={fields}
        register={register}
        errors={errors}
        showReceivedQty={showReceivedQty}
      />

      <div className="space-y-1 border-t pt-4">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("warehouse.notes", "Notes")}
        </label>
        <Textarea
          {...register("notes")}
          className="text-xs resize-none"
          rows={3}
        />
      </div>
    </div>
  );
});

TransferEditForm.displayName = "TransferEditForm";

function TransferDetailsForm({ transferId }: { transferId: string }) {
  const { data, isLoading, isError } = useTransferDetail({
    id: transferId,
    queryConfig: { enabled: !!transferId },
  });

  if (isLoading) return <TransferFormLoading />;
  if (isError || !data?.data) return <TransferFormError />;

  return <TransferDetailView transfer={data.data} />;
}

export const TransferForm = forwardRef<TransferFormRef, TransferFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { selectedTransfer } = useWarehouseStore();
    const transferId = selectedTransfer?.id;

    if (mode === "new") {
      return <NewTransferForm ref={ref} onSuccess={onSuccess} />;
    }

    if (!transferId) {
      return <TransferFormError />;
    }

    if (mode === "details") {
      return <TransferDetailsForm transferId={transferId} />;
    }

    return (
      <TransferEditForm
        ref={ref}
        transferId={transferId}
        onSuccess={onSuccess}
      />
    );
  }
);

TransferForm.displayName = "TransferForm";
