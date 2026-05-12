"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { BranchData } from "../types";

const levelLabel: Record<string, string> = {
  regional: "Regional",
  area: "Area",
  sub_area: "Sub Area",
};

const typeStyle: Record<string, string> = {
  office:    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  noc:       "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  warehouse: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  hybrid:    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const TYPE_TABS = [
  { value: "all",       label: "All" },
  { value: "office",    label: "Office" },
  { value: "noc",       label: "NOC" },
  { value: "warehouse", label: "Warehouse" },
] as const;

interface BranchComboboxProps {
  branches: BranchData[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
  onSearchChange?: (search: string) => void;
  onTypeChange?: (type: string) => void;
  branchType?: string;
  isLoading?: boolean;
}

export function BranchCombobox({
  branches,
  value,
  onValueChange,
  className,
  onSearchChange,
  onTypeChange,
  branchType = "all",
  isLoading,
}: BranchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = branches.find((b) => b.id === value);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSearch("");
      onSearchChange?.("");
    }
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full sm:w-72 justify-between font-normal", className)}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <span className="text-xs text-muted-foreground w-16 shrink-0">
                {levelLabel[selected.level]}
              </span>
              {selected.branchType && (
                <span className={cn("inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold", typeStyle[selected.branchType] ?? "bg-muted text-muted-foreground")}>
                  {selected.branchType.toUpperCase()}
                </span>
              )}
              <span className="truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Choose a branch to manage...</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder="Search branch..."
            value={search}
            onValueChange={(v) => {
              setSearch(v);
              onSearchChange?.(v);
            }}
          />
          {/* Type filter tabs */}
          <div className="flex border-b border-border">
            {TYPE_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => onTypeChange?.(t.value)}
                className={cn(
                  "flex-1 py-1.5 text-[11px] font-medium transition-colors relative",
                  "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:rounded-full",
                  branchType === t.value
                    ? "text-primary after:bg-primary"
                    : "text-muted-foreground hover:text-foreground after:bg-transparent",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No branch found."}
            </CommandEmpty>
            <CommandGroup>
              {branches.map((b) => (
                <CommandItem
                  key={b.id}
                  value={`${b.name} ${levelLabel[b.level]} ${b.branchType ?? ""}`}
                  onSelect={() => {
                    onValueChange(b.id === value ? "" : b.id);
                    setOpen(false);
                  }}
                >
                  <span className="text-xs text-muted-foreground w-16 shrink-0">
                    {levelLabel[b.level]}
                  </span>
                  {b.branchType && (
                    <span className={cn("inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold", typeStyle[b.branchType] ?? "bg-muted text-muted-foreground")}>
                      {b.branchType.toUpperCase()}
                    </span>
                  )}
                  <span className="truncate">{b.name}</span>
                  {value === b.id && <Check className="ml-auto size-4 text-primary shrink-0" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
