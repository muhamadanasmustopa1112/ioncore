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

interface BranchComboboxProps {
  branches: BranchData[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
}

export function BranchCombobox({
  branches,
  value,
  onValueChange,
  className,
  onSearchChange,
  isLoading,
}: BranchComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = branches.find((b) => b.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              <span className="truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Choose a branch to manage...</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder="Search branch..."
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No branch found."}
            </CommandEmpty>
            <CommandGroup>
              {branches.map((b) => (
                <CommandItem
                  key={b.id}
                  value={`${b.name} ${levelLabel[b.level]}`}
                  onSelect={() => {
                    onValueChange(b.id === value ? "" : b.id);
                    setOpen(false);
                  }}
                >
                  <span className="text-xs text-muted-foreground w-16 shrink-0">
                    {levelLabel[b.level]}
                  </span>
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
