"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { SlaDrilldownRecord } from "../types";

type DrilldownTableProps = {
  records: SlaDrilldownRecord[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  allSelected: boolean;
};

export function DrilldownTable({
  records,
  selectedIds,
  onSelectAll,
  onToggleRow,
  allSelected,
}: DrilldownTableProps) {
  return (
    <div className="rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-2.5 text-left">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              WO #
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Area
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Days Overdue
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-border last:border-b-0 hover:bg-muted/30"
            >
              <td className="px-3 py-2.5">
                <Checkbox
                  checked={selectedIds.has(record.id)}
                  onCheckedChange={() => onToggleRow(record.id)}
                />
              </td>
              <td className="px-3 py-2.5 font-mono text-xs font-medium text-foreground">
                {record.wo_number ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-foreground">
                {record.customer_name ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {record.area ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-center">
                {record.days_overdue !== undefined ? (
                  <span
                    className={`font-semibold ${
                      record.days_overdue >= 5
                        ? "text-red-600 dark:text-red-400"
                        : record.days_overdue >= 3
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-foreground"
                    }`}
                  >
                    {record.days_overdue}d
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2.5">
                {record.status && (
                  <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {record.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-8 text-center text-sm text-muted-foreground"
              >
                No breaching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
