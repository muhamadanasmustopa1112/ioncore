"use client";

import { useState } from "react";
import { Database, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  useNodeTypeList,
  useDeleteNodeType,
  useMaintenanceConfigList,
  useUpdateMaintenanceConfig,
  useSeedDeploymentList,
  useDeploySeed,
} from "../api/master-data-queries";
import { useMasterDataStore } from "../store/master-data";
import { NodeTypeFormSheet } from "./node-types/form/node-type-form-sheet";
import type { NetworkNodeType } from "../types/master-data";
import { MAINTENANCE_CUSTOMER_TYPES } from "../types/master-data";

type TabId = "node-types" | "maintenance" | "seed";

// ─── Node Types Tab ─────────────────────────────────────────────────────────

function NodeTypesTab() {
  const { data: nodeTypes = [], isLoading } = useNodeTypeList();
  const deleteNodeType = useDeleteNodeType();
  const openSheet = useMasterDataStore((s) => s.openSheet);

  const handleEdit = (nt: NetworkNodeType) => openSheet("edit", nt);
  const handleView = (nt: NetworkNodeType) => openSheet("details", nt);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {nodeTypes.length} node type{nodeTypes.length !== 1 ? "s" : ""}
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={() => openSheet("new")}
          className="h-8 px-3 text-xs font-semibold"
        >
          <Plus className="size-3.5" />
          Add Node Type
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Key</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Label</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Sort</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {nodeTypes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No node types configured
                  </td>
                </tr>
              )}
              {nodeTypes.map((nt) => (
                <tr key={nt.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{nt.typeKey}</td>
                  <td className="px-4 py-3 font-medium">{nt.label}</td>
                  <td className="px-4 py-3 text-muted-foreground">{nt.sortOrder}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={nt.source === "seed" ? "secondary" : "info"}
                      appearance="light"
                      className="text-xs capitalize"
                    >
                      {nt.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={nt.active ? "success" : "secondary"}
                      appearance="light"
                      className="text-xs"
                    >
                      {nt.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {nt.source === "seed" ? (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => handleView(nt)}>
                          View
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleEdit(nt)}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-destructive hover:text-destructive"
                            onClick={() => deleteNodeType.mutate(nt.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Maintenance Notice Tab ──────────────────────────────────────────────────

function MaintenanceNoticeTab() {
  const { data: configs = [], isLoading } = useMaintenanceConfigList();
  const updateConfig = useUpdateMaintenanceConfig();
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editHours, setEditHours] = useState("24");

  const getConfig = (key: string) => configs.find((c) => c.customerType === key);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Configure how many hours in advance customers are notified before scheduled maintenance.
      </p>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Customer Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Notice Lead Hours</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Last Updated By</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {MAINTENANCE_CUSTOMER_TYPES.map(({ key, label }) => {
                const cfg = getConfig(key);
                const isEditing = editingType === key;
                return (
                  <tr key={key} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{label}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          className="w-20 h-7 text-xs"
                          autoFocus
                        />
                      ) : (
                        <span>{cfg?.defaultNoticeLeadHours ?? "—"} hrs</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {cfg?.updatedBy ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="primary"
                            className="h-7 px-3 text-xs"
                            onClick={() => {
                              updateConfig.mutate(
                                { customerType: key, hours: Number(editHours) },
                                { onSuccess: () => setEditingType(null) }
                              );
                            }}
                            disabled={updateConfig.isPending}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs" onClick={() => setEditingType(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-3 text-xs"
                          onClick={() => {
                            setEditHours(String(cfg?.defaultNoticeLeadHours ?? 24));
                            setEditingType(key);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Seed Deployment Tab ─────────────────────────────────────────────────────

function SeedDeploymentTab() {
  const { data: deployments = [], isLoading } = useSeedDeploymentList();
  const deploySeed = useDeploySeed();
  const [expanded, setExpanded] = useState(false);

  const AVAILABLE_SEEDS = [
    "network_node_types",
    "maintenance_notice_config",
    "wo_types",
    "product_categories",
    "ticket_types",
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Deploy pre-configured seed data. Deployments are idempotent — existing rows are skipped.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_SEEDS.map((seed) => (
            <div key={seed} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="font-mono text-xs">{seed}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs ml-2 shrink-0"
                onClick={() => deploySeed.mutate(seed)}
                disabled={deploySeed.isPending}
              >
                Deploy
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          Deployment History
        </button>

        {expanded && (
          <div className="mt-3 rounded-lg border overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Seed</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Version</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Deployed At</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">By</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deployments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                        No deployments yet
                      </td>
                    </tr>
                  )}
                  {deployments.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs">{d.seedName}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{d.seedVersion}</td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(d.deployedAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{d.deployedBy}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={d.status === "applied" ? "success" : d.status === "pending" ? "warning" : "secondary"}
                          appearance="light"
                          className="capitalize text-xs"
                        >
                          {d.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "node-types", label: "Network Node Types" },
  { id: "maintenance", label: "Maintenance Notice" },
  { id: "seed", label: "Seed Deployment" },
];

export function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabId>("node-types");

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Master Data" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Master Data &amp; Seed Management
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <Database className="size-3.5" />
              Foundational reference data
            </Badge>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0" />
      </Toolbar>

      <div className="mt-4">
        {/* Tabs */}
        <div className="flex gap-0 border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "node-types" && <NodeTypesTab />}
          {activeTab === "maintenance" && <MaintenanceNoticeTab />}
          {activeTab === "seed" && <SeedDeploymentTab />}
        </div>
      </div>

      <NodeTypeFormSheet />
    </div>
  );
}
