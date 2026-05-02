"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";

interface BranchAvailabilityProps {
  assignedBranchIds: string[];
  onAdd: (branchId: string) => void;
  onRemove: (branchId: string) => void;
  isPending?: boolean;
  readOnly?: boolean;
}

export function BranchAvailability({ assignedBranchIds, onAdd, onRemove, isPending, readOnly }: BranchAvailabilityProps) {
  const { data: branches = [] } = useBranchList();
  const [adding, setAdding] = useState("");

  const assigned = branches.filter((b) => assignedBranchIds.includes(b.id));
  const available = branches.filter((b) => !assignedBranchIds.includes(b.id));

  const levelLabel = (level: string) =>
    level === "sub_area" ? "Sub Area" : level === "area" ? "Area" : "Regional";

  const levelClass = (level: string) => {
    if (level === "regional") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (level === "area") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-4">
      {!readOnly && (
        <div className="flex gap-2">
          <Select value={adding} onValueChange={setAdding}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={available.length ? "Select branch to assign..." : "All branches assigned"} />
            </SelectTrigger>
            <SelectContent>
              {available.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <span className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-semibold ${levelClass(b.level)}`}>
                      {levelLabel(b.level)}
                    </span>
                    {b.name}
                    <span className="font-mono text-xs text-muted-foreground">({b.code})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="primary"
            className="shrink-0"
            disabled={!adding || isPending}
            onClick={() => { onAdd(adding); setAdding(""); }}
          >
            <RiAddLine className="size-4" /> Assign
          </Button>
        </div>
      )}

      {assigned.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No branches assigned yet.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {assigned.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-md border px-3 py-2.5">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 ${levelClass(b.level)}`}>
                  {levelLabel(b.level)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.name}</p>
                  {b.parentName && <p className="text-xs text-muted-foreground truncate">{b.parentName}</p>}
                </div>
                <span className="font-mono text-xs text-muted-foreground shrink-0">{b.code}</span>
                {!readOnly && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={isPending}
                    onClick={() => onRemove(b.id)}
                  >
                    <X className="size-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <p className="text-xs text-muted-foreground">
        {assigned.length} branch{assigned.length !== 1 ? "es" : ""} assigned
      </p>
    </div>
  );
}
