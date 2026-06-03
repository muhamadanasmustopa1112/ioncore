"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { DUMMY_NETWORK_NODES } from "../../data/dummy-maintenance";
import { DUMMY_DOWNSTREAM_NODES } from "../../data/dummy-areas";
import type { MaintenanceImpactedNode, NodeImpactRole } from "../../types";

type NodeSelectorProps = {
  value: MaintenanceImpactedNode[];
  onChange: (nodes: MaintenanceImpactedNode[]) => void;
  disabled?: boolean;
};

const ROLE_LABEL: Record<NodeImpactRole, string> = {
  primary: "Primary",
  upstream: "Upstream",
  downstream: "Downstream",
};

const ROLE_VARIANT: Record<NodeImpactRole, "primary" | "secondary" | "outline"> = {
  primary: "primary",
  upstream: "secondary",
  downstream: "outline",
};

const NODE_TYPE_LABEL: Record<string, string> = {
  olt: "OLT",
  odp: "ODP",
  router: "Router",
  switch: "Switch",
  splitter: "Splitter",
  other: "Other",
};

export function NodeSelector({ value, onChange, disabled }: NodeSelectorProps) {
  const [search, setSearch] = useState("");

  const available = DUMMY_NETWORK_NODES.filter(
    (n) => !value.some((v) => v.node_id === n.node_id)
      && (search === "" || n.node_name.toLowerCase().includes(search.toLowerCase())),
  );

  const addNode = (nodeId: string, role: NodeImpactRole) => {
    const node = DUMMY_NETWORK_NODES.find((n) => n.node_id === nodeId);
    if (!node) return;
    const next = [...value, { node_id: node.node_id, node_name: node.node_name, node_type: node.node_type, impact_role: role }];
    onChange(next);
    if (role === "primary") suggestDownstreams(node.node_id, next);
  };

  const suggestDownstreams = (primaryId: string, current: MaintenanceImpactedNode[]) => {
    const downstreamIds = DUMMY_DOWNSTREAM_NODES[primaryId];
    if (!downstreamIds) return;
    const existing = new Set(current.map((n) => n.node_id));
    const additions = downstreamIds
      .filter((id) => !existing.has(id))
      .map((id) => {
        const node = DUMMY_NETWORK_NODES.find((n) => n.node_id === id);
        return node ? { node_id: node.node_id, node_name: node.node_name, node_type: node.node_type, impact_role: "downstream" as NodeImpactRole } : null;
      })
      .filter(Boolean) as MaintenanceImpactedNode[];
    if (additions.length > 0) onChange([...current, ...additions]);
  };

  const removeNode = (nodeId: string) => {
    onChange(value.filter((n) => n.node_id !== nodeId));
  };

  const updateRole = (nodeId: string, role: NodeImpactRole) => {
    onChange(value.map((n) => n.node_id === nodeId ? { ...n, impact_role: role } : n));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((node) => (
          <Badge key={node.node_id} variant={ROLE_VARIANT[node.impact_role]} className="gap-1 pr-1">
            <span className="font-medium">{node.node_name}</span>
            <span className="text-[10px] opacity-70">({NODE_TYPE_LABEL[node.node_type] ?? node.node_type})</span>
            <Select value={node.impact_role} onValueChange={(v) => updateRole(node.node_id, v as NodeImpactRole)} disabled={disabled}>
              <SelectTrigger className="h-4 w-auto border-none bg-transparent p-0 text-[10px] hover:bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">{ROLE_LABEL.primary}</SelectItem>
                <SelectItem value="upstream">{ROLE_LABEL.upstream}</SelectItem>
                <SelectItem value="downstream">{ROLE_LABEL.downstream}</SelectItem>
              </SelectContent>
            </Select>
            {!disabled && (
              <button type="button" onClick={() => removeNode(node.node_id)} className="ml-0.5 rounded-full p-0.5 hover:bg-muted">
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {!disabled && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-48 text-sm"
          />
          <Select onValueChange={(v) => { const [nodeId, role] = v.split("::") as [string, NodeImpactRole]; addNode(nodeId, role); setSearch(""); }}>
            <SelectTrigger className="h-8 w-auto text-sm">
              <SelectValue placeholder="Add node" />
            </SelectTrigger>
            <SelectContent>
              {available.map((node) => (
                <SelectItem key={node.node_id} value={`${node.node_id}::primary`}>
                  {node.node_name} ({NODE_TYPE_LABEL[node.node_type] ?? node.node_type}) — {node.area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
