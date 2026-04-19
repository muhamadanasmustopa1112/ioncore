"use client";

import { useState } from "react";
import { SlidersHorizontal, CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  usePlatformConfigList,
  useUpdatePlatformConfig,
  useResetPlatformConfig,
  useTestConnection,
} from "../api/platform-config-queries";
import type { PlatformConfig, ConfigCategory } from "../types/platform-config";
import { CATEGORY_LABELS, INTEGRATION_KEYS } from "../types/platform-config";

const CATEGORIES: ConfigCategory[] = [
  "stock_warehouse",
  "network",
  "payment_gateway",
  "integrations",
  "tax_legal",
  "map_navigation",
  "general",
  "per_branch",
];

function ConfigRow({ config }: { config: PlatformConfig }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const updateConfig = useUpdatePlatformConfig();
  const resetConfig = useResetPlatformConfig();
  const testConn = useTestConnection();
  const isIntegration = INTEGRATION_KEYS.includes(config.key);

  const displayValue = config.isSensitive
    ? "••••••••••••"
    : config.dataType === "json"
      ? JSON.stringify(config.value)
      : String(config.value ?? "");

  const handleEdit = () => {
    setEditValue(config.isSensitive ? "" : String(config.value ?? ""));
    setEditing(true);
  };

  const handleSave = () => {
    let parsed: unknown = editValue;
    if (config.dataType === "number") parsed = Number(editValue);
    if (config.dataType === "boolean") parsed = editValue === "true";
    if (config.dataType === "json") {
      try { parsed = JSON.parse(editValue); } catch { /* keep string */ }
    }
    updateConfig.mutate(
      { key: config.key, payload: { value: parsed } },
      { onSuccess: () => setEditing(false) }
    );
  };

  return (
    <div className="flex items-start gap-4 border-b py-4 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-medium">{config.key}</span>
          {config.required && (
            <Badge variant="destructive" appearance="light" className="text-xs">required</Badge>
          )}
          {config.isSensitive && (
            <Badge variant="warning" appearance="light" className="text-xs">sensitive</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            {config.dataType === "boolean" ? (
              <Select value={editValue} onValueChange={setEditValue}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">false</SelectItem>
                </SelectContent>
              </Select>
            ) : config.dataType === "enum" && config.allowedValues ? (
              <Select value={editValue} onValueChange={setEditValue}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.allowedValues.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-52 h-8 text-xs font-mono"
                type={config.isSensitive ? "password" : "text"}
                autoFocus
              />
            )}
            <Button
              size="sm"
              variant="primary"
              className="h-8 px-3 text-xs"
              onClick={handleSave}
              disabled={updateConfig.isPending}
            >
              {updateConfig.isPending ? <Loader2 className="size-3 animate-spin" /> : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
              {displayValue || <span className="italic opacity-50">not set</span>}
            </span>
            {isIntegration && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => testConn.mutate(config.key)}
                disabled={testConn.isPending}
              >
                {testConn.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : testConn.data?.data?.status === "ok" ? (
                  <CheckCircle2 className="size-3 text-success" />
                ) : testConn.data?.data?.status === "error" ? (
                  <XCircle className="size-3 text-destructive" />
                ) : null}
                Test
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              mode="icon"
              className="h-8 w-8"
              title="Reset to default"
              onClick={() => resetConfig.mutate(config.key)}
              disabled={resetConfig.isPending}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryPanel({ category }: { category: ConfigCategory }) {
  const { data: configs = [], isLoading } = usePlatformConfigList(category);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!configs.length) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No configuration keys in this category.
      </p>
    );
  }

  return (
    <div>
      {configs.map((config) => (
        <ConfigRow key={config.key} config={config} />
      ))}
    </div>
  );
}

export function PlatformConfigPage() {
  const [activeCategory, setActiveCategory] = useState<ConfigCategory>("general");

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Platform Config" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Platform Config Manager
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <SlidersHorizontal className="size-3.5" />
              Global &amp; Per-Branch Settings
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4 flex h-[calc(100%-9rem)] gap-0 rounded-lg border overflow-hidden bg-card">
        {/* Sidebar */}
        <div className="w-52 shrink-0 border-e bg-muted/30 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base font-semibold">
                {CATEGORY_LABELS[activeCategory]}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click Edit on any row to change its value.
              </p>
            </div>
          </div>
          <CategoryPanel category={activeCategory} />
        </div>
      </div>
    </div>
  );
}
