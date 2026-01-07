"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  [key: string]: any;
}

interface MultiSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  options?: MultiSelectOption[];
  isLoading?: boolean;
  isFetching?: boolean;
  hasNextPage?: boolean;
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  searchDebounceMs?: number;
  maxHeight?: string;
  emptyText?: string;
  showCount?: boolean;
  renderOption?: (option: MultiSelectOption, selected: boolean) => React.ReactNode;
}

export function MultiSelect({
  value = [],
  onChange,
  placeholder = "Select items",
  className,
  options = [],
  isLoading = false,
  isFetching = false,
  hasNextPage = false,
  onSearch,
  onLoadMore,
  searchDebounceMs = 1000,
  maxHeight = "300px",
  emptyText = "No data found",
  showCount = true,
  renderOption,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>(value);
  const [tempSelected, setTempSelected] = useState<string[]>(value);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      onSearch?.(searchInput);
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, searchDebounceMs, onSearch]);

  // Handle scroll to load more data
  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || isFetching || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Trigger fetch when scrolled to 80% of content
    if (scrollPercentage > 0.8) {
      onLoadMore?.();
    }
  }, [isFetching, hasNextPage, onLoadMore]);

  // Sync temp selected with actual value when popover opens
  useEffect(() => {
    if (open) {
      setTempSelected(selectedItems);
    }
  }, [open, selectedItems]);

  // Sync with external value changes
  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  const handleSelect = useCallback(
    (itemValue: string) => {
      const newSelected = tempSelected.includes(itemValue)
        ? tempSelected.filter((id) => id !== itemValue)
        : [...tempSelected, itemValue];

      setTempSelected(newSelected);
    },
    [tempSelected]
  );

  const handleRemove = useCallback(
    (itemValue: string) => {
      const newSelected = selectedItems.filter((id) => id !== itemValue);
      setSelectedItems(newSelected);
      setTempSelected(newSelected);
      onChange?.(newSelected);
    },
    [selectedItems, onChange]
  );

  const handleClearAll = useCallback(() => {
    setSelectedItems([]);
    setTempSelected([]);
    onChange?.([]);
  }, [onChange]);

  const handleApply = useCallback(() => {
    setSelectedItems(tempSelected);
    onChange?.(tempSelected);
    setOpen(false);
  }, [tempSelected, onChange]);

  const handleCancel = useCallback(() => {
    setTempSelected(selectedItems);
    setOpen(false);
  }, [selectedItems]);

  const selectedLabels = options
    .filter((opt) => selectedItems.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <span className="truncate">
            {selectedItems.length > 0 && showCount
              ? `${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} selected`
              : selectedItems.length > 0 && selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {selectedItems.length > 0 && (
              <span
                className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClearAll();
                  setOpen(false);
                }}
                aria-label="Clear selected items"
                title="Clear all"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <div className="flex flex-col">
          {/* Search Input */}
          {onSearch && (
            <div className="relative border-b p-2">
              <Search className="text-muted-foreground absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 pl-8 pr-8"
              />
              {searchInput && (
                <Button
                  mode="icon"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                    onSearch("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Options List with Infinite Scroll */}
          <ScrollArea style={{ height: maxHeight }}>
            <div
              className="p-1"
              ref={scrollViewportRef}
              onScroll={handleScroll}
              style={{ maxHeight, overflowY: "auto" }}
            >
              {isLoading && options.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : options.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                <>
                  {options.map((option) => {
                    const isSelected = tempSelected.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => handleSelect(option.value)}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleSelect(option.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="flex-1 truncate text-sm">
                              {option.label}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* Infinite Scroll Loading Indicator */}
                  {isFetching && hasNextPage && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t p-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-red-100 hover:bg-red-200"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              Apply ({tempSelected.length})
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
