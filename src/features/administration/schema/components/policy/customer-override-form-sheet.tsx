"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  useCreateCustomerSchema,
  useSchemas,
} from "@/features/rule-schema";
import type { Schema } from "@/features/rule-schema";
import { useCustomerList } from "@/features/customers/api/customers-queries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PickerOption {
  id: string;
  primary: string;
  secondary?: string;
  keywords: string[];
  meta?: Record<string, string>;
}

interface IdPickerProps {
  value: string;
  options: PickerOption[];
  onSelect: (option: PickerOption) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
}

function IdPicker({
  value,
  options,
  onSelect,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
}: IdPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {selected
              ? `${selected.primary}${selected.secondary ? ` — ${selected.secondary}` : ""}`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width] min-w-[320px]"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.id}
                  keywords={opt.keywords}
                  onSelect={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      opt.id === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm">{opt.primary}</span>
                    {opt.secondary && (
                      <span className="truncate text-xs text-muted-foreground font-mono">
                        {opt.secondary}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CustomerOverrideFormSheet({ open, onOpenChange }: Props) {
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [customerId, setCustomerId] = useState("");

  const { data: schemasEnv, isLoading: schemasLoading } = useSchemas({ size: 100 });
  const { data: customersData, isLoading: customersLoading } = useCustomerList({ size: 100 });

  const schemaOptions = useMemo<PickerOption[]>(
    () =>
      (schemasEnv?.data.schemas ?? []).map((s) => ({
        id: s.id,
        primary: s.name,
        secondary: s.schema_type ?? s.id,
        keywords: [s.name, s.id, s.schema_type ?? ""],
        meta: { schema_type: s.schema_type ?? "", latest_version: s.latest_version ?? "" },
      })),
    [schemasEnv],
  );

  const customerOptions = useMemo<PickerOption[]>(
    () =>
      (customersData?.items ?? []).map((c) => ({
        id: c.id,
        primary: c.full_name + (c.company_name ? ` (${c.company_name})` : ""),
        secondary: c.id,
        keywords: [c.full_name, c.company_name ?? "", c.id],
      })),
    [customersData],
  );

  const create = useCreateCustomerSchema();
  const canSubmit = !!selectedSchema && !!customerId;

  const reset = () => {
    setSelectedSchema(null);
    setCustomerId("");
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!canSubmit || !selectedSchema) return;
    create.mutate(
      {
        customer_id: customerId,
        schema_id: selectedSchema.id,
        schema_type: (selectedSchema.schema_type ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_"),
        schema_version_id: selectedSchema.latest_version ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Customer schema created");
          handleClose(false);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Failed to create customer schema";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            New Customer Schema
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-auto px-5 py-5 space-y-5">
          <div className="space-y-2">
            <Label>Base Schema</Label>
            <IdPicker
              value={selectedSchema?.id ?? ""}
              options={schemaOptions}
              onSelect={(opt) => {
                const found = (schemasEnv?.data.schemas ?? []).find((s) => s.id === opt.id) ?? null;
                setSelectedSchema(found);
              }}
              placeholder={schemasLoading ? "Loading schemas..." : "Select a schema"}
              searchPlaceholder="Search by name or type..."
              emptyText="No schemas found."
              disabled={schemasLoading}
            />
            {selectedSchema && (
              <p className="text-xs text-muted-foreground">
                Type: <span className="font-medium capitalize">{selectedSchema.schema_type}</span>
                {selectedSchema.latest_version && (
                  <> · Version: <span className="font-mono">{selectedSchema.latest_version}</span></>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Customer</Label>
            <IdPicker
              value={customerId}
              options={customerOptions}
              onSelect={(opt) => setCustomerId(opt.id)}
              placeholder={customersLoading ? "Loading customers..." : "Select a customer"}
              searchPlaceholder="Search by name or id..."
              emptyText="No customers found."
              disabled={customersLoading}
            />
          </div>
        </SheetBody>
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <div className="flex-1" />
          <Button
            variant="primary"
            className="font-semibold"
            onClick={handleSubmit}
            disabled={!canSubmit || create.isPending}
          >
            {create.isPending ? "Creating..." : "Create Schema"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
