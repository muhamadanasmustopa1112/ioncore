"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useWorkOrderDetail, useUpdateChecklistItem } from "../api/work-order-queries";

export function ChecklistPanel({ workOrderId }: { workOrderId: string }) {
  const { data: wo, isLoading } = useWorkOrderDetail(workOrderId);
  const updateItem = useUpdateChecklistItem();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!wo?.checklists.length) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        No checklists attached.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {wo.checklists.map((cl) => {
        const total = cl.items.length;
        const checked = cl.items.filter((i) => i.isChecked).length;
        const isOpen = expanded[cl.id] ?? true;

        return (
          <div key={cl.id} className="rounded-md border overflow-hidden">
            <button
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              onClick={() => setExpanded((p) => ({ ...p, [cl.id]: !isOpen }))}
            >
              {isOpen ? (
                <ChevronDown className="size-3.5 shrink-0" />
              ) : (
                <ChevronRight className="size-3.5 shrink-0" />
              )}
              <span className="text-sm font-medium flex-1">{cl.name}</span>
              <span className="text-xs text-muted-foreground">
                {checked}/{total}
              </span>
            </button>

            {isOpen && (
              <div className="divide-y">
                {cl.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-3 py-2.5">
                    <Checkbox
                      checked={item.isChecked}
                      disabled={updateItem.isPending}
                      onCheckedChange={(checked) => {
                        updateItem.mutate({
                          workOrderId,
                          itemId: item.id,
                          payload: { is_checked: !!checked },
                        });
                      }}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          item.isChecked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.itemName}
                        {item.isRequired && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-info mt-0.5 italic">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    {item.checkedAt && (
                      <CheckCircle2 className="size-3.5 text-success shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
