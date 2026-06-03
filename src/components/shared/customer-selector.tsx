"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCustomerList } from "@/features/customers/api/customers-queries";
import type { CustomerDto } from "@/features/customers/types/customers-api";

interface CustomerSelectorProps {
  value: string;
  onChange: (customer: CustomerDto | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500",
  pending: "bg-amber-500",
  suspended: "bg-red-500",
  deactivated: "bg-gray-400",
  churned: "bg-gray-500",
};

export function CustomerSelector({
  value,
  onChange,
  disabled,
  placeholder,
}: CustomerSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching } = useCustomerList({
    search: search || undefined,
    page: 1,
    size: 50,
  });

  const customers = data?.items ?? [];

  const selectedCustomer = customers.find((c) => c.id === value);

  const handleSelect = useCallback(
    (customer: CustomerDto) => {
      onChange(customer);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const placeholderText =
    placeholder || t("billing.invoice.selectCustomer", "Select customer");

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
            !selectedCustomer && "text-muted-foreground"
          )}
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedCustomer.full_name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                ({selectedCustomer.customer_type})
              </span>
              <div
                className={cn(
                  "size-2 rounded-full shrink-0",
                  statusColors[selectedCustomer.status] || "bg-gray-400"
                )}
              />
            </div>
          ) : (
            <span>{placeholderText}</span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            {selectedCustomer && (
              <X
                className="size-3 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleClear}
              />
            )}
            {isLoading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ChevronsUpDown className="size-3 text-muted-foreground" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t("billing.invoice.searchCustomer", "Search customer...")}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  {t("common.searching", "Searching...")}
                </div>
              ) : (
                t("billing.invoice.noCustomers", "No customers found")
              )}
            </CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.full_name} ${customer.id}`}
                  onSelect={() => handleSelect(customer)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-1 items-center gap-2 truncate">
                    <span className="truncate font-medium">
                      {customer.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {customer.customer_type}
                    </span>
                    <div
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        statusColors[customer.status] || "bg-gray-400"
                      )}
                    />
                    {customer.branch_name && (
                      <span className="text-xs text-muted-foreground truncate">
                        {customer.branch_name}
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
