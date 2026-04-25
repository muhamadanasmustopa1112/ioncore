"use client";

import { useState } from "react";
import {
  RiFlashlightLine,
  RiToolsLine,
  RiCloseLine,
  RiSaveLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DUMMY_CHANGE_MATRIX } from "../../data/dummy-policies";
import { ChangeMatrixEntry, ChangeAction, ChangeType } from "../../types/policy-types";
import { CustomerType } from "../../types";

const CUSTOMER_TYPES: CustomerType[] = ["residential", "business", "enterprise", "corporate"];

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  residential: "Residential",
  business: "Business",
  enterprise: "Enterprise",
  corporate: "Corporate",
};

const ACTION_CONFIG: Record<ChangeAction, { label: string; icon: React.ReactNode; class: string; badge: "success" | "warning" | "destructive" }> = {
  instant: {
    label: "Instant",
    icon: <RiFlashlightLine className="size-3.5" />,
    class: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    badge: "success",
  },
  wo_required: {
    label: "WO Required",
    icon: <RiToolsLine className="size-3.5" />,
    class: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    badge: "warning",
  },
  not_allowed: {
    label: "Not Allowed",
    icon: <RiCloseLine className="size-3.5" />,
    class: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
    badge: "destructive",
  },
};

const ACTION_CYCLE: ChangeAction[] = ["instant", "wo_required", "not_allowed"];

export function ChangeMatrixPanel() {
  const [matrix, setMatrix] = useState(DUMMY_CHANGE_MATRIX);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DUMMY_CHANGE_MATRIX);

  const cycleAction = (id: string, col: CustomerType) => {
    setDraft((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const current = row[col] as ChangeAction;
        const next = ACTION_CYCLE[(ACTION_CYCLE.indexOf(current) + 1) % ACTION_CYCLE.length];
        return { ...row, [col]: next };
      })
    );
  };

  const saveChanges = () => {
    setMatrix(draft);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(matrix);
    setEditing(false);
  };

  const displayData = editing ? draft : matrix;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Defines whether each type of service change is processed instantly or requires a Work Order,
        per customer type. Click a cell while editing to cycle through: Instant → WO Required → Not Allowed.
      </p>

      {/* Legend + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {Object.entries(ACTION_CONFIG).map(([action, config]) => (
            <div key={action} className="flex items-center gap-1.5">
              <Badge variant={config.badge} appearance="light" className="text-[11px] px-2 gap-1">
                {config.icon}
                {config.label}
              </Badge>
            </div>
          ))}
        </div>
        {!editing ? (
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium" onClick={() => setEditing(true)}>
            Edit Matrix
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 px-3" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="h-9 px-4 font-medium" onClick={saveChanges}>
              <RiSaveLine className="size-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Matrix table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground w-48">
                  Change Type
                </th>
                {CUSTOMER_TYPES.map((type) => (
                  <th
                    key={type}
                    className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {CUSTOMER_TYPE_LABELS[type]}
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {displayData.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-sm">
                    {row.change_label}
                  </td>
                  {CUSTOMER_TYPES.map((col) => {
                    const action = row[col] as ChangeAction;
                    const config = ACTION_CONFIG[action];
                    return (
                      <td key={col} className="px-4 py-3 text-center">
                        <button
                          disabled={!editing}
                          onClick={() => cycleAction(row.id, col)}
                          className={[
                            "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all",
                            config.class,
                            editing ? "cursor-pointer" : "cursor-default",
                          ].join(" ")}
                        >
                          {config.icon}
                          {config.label}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
                    {row.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <p className="text-xs text-muted-foreground text-center">
          Click any cell to cycle: Instant → WO Required → Not Allowed
        </p>
      )}
    </div>
  );
}
