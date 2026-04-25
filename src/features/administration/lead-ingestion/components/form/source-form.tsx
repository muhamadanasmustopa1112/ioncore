"use client";

import { useCallback, useEffect, useState } from "react";
import { RiInformationLine, RiKey2Line, RiSettings3Line } from "@remixicon/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useLeadIngestionStore } from "../../store/lead-ingestion";
import {
  ExternalSource,
  SourceStatus,
  SourceType,
} from "../../types/lead-ingestion";
import type {
  CustomerSubType,
  LeadSource,
  LeadType,
} from "@/features/leads/types/leads-api";

function genApiKey(prefix: string) {
  const rand = Array.from({ length: 20 }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");
  return `${prefix}_${rand}`;
}

const TYPE_PREFIX: Record<SourceType, string> = {
  web_form: "wf",
  partner_api: "pa",
  marketplace: "mk",
  affiliate: "af",
  csv_upload: "cu",
};

interface Props {
  onSubmit?: () => void;
}

export function SourceForm({ onSubmit }: Props) {
  const { form, selectedSource, upsertSource } = useLeadIngestionStore();
  const { data: branches = [], isLoading: branchesLoading } = useBranchList();
  const isDetail = form === "details";

  const [name, setName] = useState("");
  const [type, setType] = useState<SourceType>("web_form");
  const [defaultBranchId, setDefaultBranchId] = useState("");
  const [defaultLeadType, setDefaultLeadType] = useState<LeadType>("broadband");
  const [defaultCustomerSubType, setDefaultCustomerSubType] = useState<CustomerSubType>("residential");
  const [defaultSource, setDefaultSource] = useState<LeadSource>("website");
  const [status, setStatus] = useState<SourceStatus>("active");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (selectedSource && (form === "edit" || form === "details")) {
      const s = selectedSource;
      setName(s.name);
      setType(s.type);
      setDefaultBranchId(s.defaultBranchId);
      setDefaultLeadType(s.defaultLeadType);
      setDefaultCustomerSubType(s.defaultCustomerSubType);
      setDefaultSource(s.defaultSource);
      setStatus(s.status);
      setApiKey(s.apiKey);
    } else if (form === "new") {
      setName("");
      setType("web_form");
      setDefaultBranchId("");
      setDefaultLeadType("broadband");
      setDefaultCustomerSubType("residential");
      setDefaultSource("website");
      setStatus("active");
      setApiKey(genApiKey(TYPE_PREFIX.web_form));
    }
  }, [selectedSource, form]);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      toast.error("Source name is required");
      return;
    }
    if (!defaultBranchId) {
      toast.error("Default branch is required");
      return;
    }
    const now = new Date().toISOString();
    const payload: ExternalSource = {
      id: selectedSource?.id ?? `src-${Date.now()}`,
      name: name.trim(),
      type,
      apiKey,
      webhookUrl:
        selectedSource?.webhookUrl ??
        `https://api.ion.id/ingest/v1/leads/${`src-${Date.now()}`}`,
      defaultBranchId,
      defaultLeadType,
      defaultCustomerSubType,
      defaultSource,
      status,
      createdAt: selectedSource?.createdAt ?? now,
      updatedAt: now,
    };
    upsertSource(payload);
    toast.success(form === "new" ? "Source added" : "Source updated");
    onSubmit?.();
  }, [
    name,
    type,
    apiKey,
    defaultBranchId,
    defaultLeadType,
    defaultCustomerSubType,
    defaultSource,
    status,
    selectedSource,
    form,
    upsertSource,
    onSubmit,
  ]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__leadIngestionFormSubmit = handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__leadIngestionFormSubmit;
    };
  }, [handleSubmit]);

  const activeBranches = branches.filter((b) => b.active);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Source Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Tokopedia Partner Feed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetail}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => {
                    const next = v as SourceType;
                    setType(next);
                    if (form === "new") setApiKey(genApiKey(TYPE_PREFIX[next]));
                  }}
                  disabled={isDetail}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web_form">Web Form</SelectItem>
                    <SelectItem value="partner_api">Partner API</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="csv_upload">CSV Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as SourceStatus)} disabled={isDetail}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiKey2Line className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Credentials</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">API Key</Label>
              <div className="flex gap-2">
                <Input value={apiKey} readOnly className="font-mono text-xs" />
                {!isDetail && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                    onClick={() => setApiKey(genApiKey(TYPE_PREFIX[type]))}
                  >
                    Regenerate
                  </button>
                )}
              </div>
            </div>

            {selectedSource?.webhookUrl && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Webhook URL</Label>
                <Input value={selectedSource.webhookUrl} readOnly className="font-mono text-xs" />
              </div>
            )}
          </div>

          {/* Defaults */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiSettings3Line className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Lead Defaults</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Default Branch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={defaultBranchId}
                onValueChange={setDefaultBranchId}
                disabled={isDetail || branchesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={branchesLoading ? "Loading branches…" : "Select branch"} />
                </SelectTrigger>
                <SelectContent>
                  {activeBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      <span>{b.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground capitalize">
                        {b.level.replace("_", " ")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Lead Type</Label>
                <Select value={defaultLeadType} onValueChange={(v) => setDefaultLeadType(v as LeadType)} disabled={isDetail}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broadband">Broadband</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Sub Type</Label>
                <Select value={defaultCustomerSubType} onValueChange={(v) => setDefaultCustomerSubType(v as CustomerSubType)} disabled={isDetail}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Source Tag</Label>
                <Select value={defaultSource} onValueChange={(v) => setDefaultSource(v as LeadSource)} disabled={isDetail}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="cold_call">Cold Call</SelectItem>
                    <SelectItem value="cs">CS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
