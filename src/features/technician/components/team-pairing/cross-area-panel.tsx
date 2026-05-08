"use client";

import { format } from "date-fns";
import { Loader2, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApproveCrossAreaRequest, useRejectCrossAreaRequest } from "../../api/cross-area";
import type { CrossAreaRequest, CrossAreaRequestStatus } from "../../types/technician-api";

const STATUS_VARIANT: Record<CrossAreaRequestStatus, "warning" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

function fmtDate(s: string | null | undefined) {
  if (!s) return "—";
  try { return format(new Date(s), "PP p"); } catch { return s; }
}

function CrossAreaRow({ req }: { req: CrossAreaRequest }) {
  const approveMutation = useApproveCrossAreaRequest();
  const rejectMutation = useRejectCrossAreaRequest();

  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={STATUS_VARIANT[req.status]} appearance="light" size="sm" className="uppercase">
              {req.status}
            </Badge>
            <span className="text-[10px] text-slate-400">{fmtDate(req.created_at)}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {req.requesting_leader_name}
            <span className="text-slate-400 font-normal"> requests from </span>
            {req.lending_leader_name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Area {req.requesting_area_id} → {req.lending_area_id} · {Array.isArray(req.candidate_technician_ids) ? req.candidate_technician_ids.length : 0} candidates
          </p>
          {req.note && <p className="text-xs text-slate-500 mt-1 italic">{req.note}</p>}
        </div>
      </div>

      {req.status === "pending" && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => approveMutation.mutate({ id: req.id, data: { approved_technician_ids: Array.isArray(req.candidate_technician_ids) ? req.candidate_technician_ids : [] } })}
            disabled={approveMutation.isPending || rejectMutation.isPending}
            className="text-[10px] uppercase font-bold"
          >
            {approveMutation.isPending && <Loader2 className="size-3 animate-spin mr-1" />}
            Approve All
          </Button>
          <Button
            variant="destructive"
            appearance="ghost"
            size="sm"
            onClick={() => rejectMutation.mutate({ id: req.id, data: { note: "Rejected by team leader" } })}
            disabled={approveMutation.isPending || rejectMutation.isPending}
            className="text-[10px] uppercase font-bold"
          >
            {rejectMutation.isPending && <Loader2 className="size-3 animate-spin mr-1" />}
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export function CrossAreaPanel({ requests }: { requests: CrossAreaRequest[] }) {
  const pending = requests.filter((r) => r.status === "pending");

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Network className="size-4 text-primary" />
          Cross-Area Requests
          {pending.length > 0 && (
            <Badge variant="warning" appearance="light" size="sm">{pending.length} pending</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={`p-0 ${requests.length > 5 ? "max-h-[380px] overflow-y-auto scrollbar-thin" : ""}`}>
        {requests.length === 0 ? (
          <p className="text-sm text-slate-400 italic p-4">No cross-area requests.</p>
        ) : (
          requests.map((req) => <CrossAreaRow key={req.id} req={req} />)
        )}
      </CardContent>
    </Card>
  );
}
