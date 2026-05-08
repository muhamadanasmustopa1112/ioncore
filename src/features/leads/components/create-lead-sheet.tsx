"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { RiUserAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useCustomerList } from "@/features/customers/api/customers-queries";
import type { CustomerStatus } from "@/features/customers/types/customers-api";
import { useCreateLead } from "../api/leads-queries";
import type {
  CreateLeadPayload,
  CustomerSubType,
  LeadSource,
  LeadType,
} from "../types/leads-api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const LEAD_TYPES: { value: LeadType; label: string }[] = [
  { value: "broadband", label: "Broadband" },
  { value: "enterprise", label: "Enterprise" },
];

const SUB_TYPES: { value: CustomerSubType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "business", label: "Business" },
];

const SOURCES: { value: LeadSource; label: string }[] = [
  { value: "referral", label: "Referral" },
  { value: "website", label: "Website" },
  { value: "cold_call", label: "Cold Call" },
  { value: "cs", label: "Customer Service" },
  { value: "other", label: "Other" },
];

const STATUS_STYLES: Record<CustomerStatus, string> = {
  active: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  suspended: "bg-destructive/15 text-destructive",
  deactivated: "bg-muted text-muted-foreground",
  churned: "bg-muted text-muted-foreground",
};

function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize shrink-0 ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function resetState() {
  return {
    leadName: "",
    leadType: "broadband" as LeadType,
    subType: "residential" as CustomerSubType,
    source: "referral" as LeadSource,
    referrerCustomerId: "",
    branchId: "",
  };
}

export function CreateLeadSheet({ open, onClose }: Props) {
  const initial = resetState();
  const [leadName, setLeadName] = useState(initial.leadName);
  const [leadType, setLeadType] = useState<LeadType>(initial.leadType);
  const [subType, setSubType] = useState<CustomerSubType>(initial.subType);
  const [source, setSource] = useState<LeadSource>(initial.source);
  const [referrerCustomerId, setReferrerCustomerId] = useState(initial.referrerCustomerId);
  const [branchId, setBranchId] = useState(initial.branchId);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);

  const { data: branches = [], isLoading: branchesLoading } = useBranchList();
  const { data: customersData, isLoading: customersLoading } = useCustomerList(
    source === "referral" ? { search: customerSearch || undefined, size: 20 } : {}
  );
  const createLead = useCreateLead();

  const activeBranches = useMemo(() => branches.filter((b) => b.active), [branches]);

  const customerOptions = useMemo(
    () => (source === "referral" ? (customersData?.items ?? []) : []),
    [source, customersData]
  );

  const selectedCustomer = useMemo(
    () => customerOptions.find((c) => c.id === referrerCustomerId) ?? null,
    [customerOptions, referrerCustomerId]
  );

  const canSubmit =
    !!leadName.trim() &&
    !!branchId &&
    !createLead.isPending &&
    (source !== "referral" || !!referrerCustomerId);

  function handleOpenChange(o: boolean) {
    if (!o) {
      const s = resetState();
      setLeadName(s.leadName);
      setLeadType(s.leadType);
      setSubType(s.subType);
      setSource(s.source);
      setReferrerCustomerId(s.referrerCustomerId);
      setBranchId(s.branchId);
      setCustomerSearch("");
      setCustomerPickerOpen(false);
      onClose();
    }
  }

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload: CreateLeadPayload = {
      lead_type: leadType,
      customer_sub_type: subType,
      lead_name: leadName.trim(),
      source,
      branch_id: branchId,
      referrer_customer_id:
        source === "referral" && referrerCustomerId ? referrerCustomerId : null,
    };
    createLead.mutate(payload, { onSuccess: () => handleOpenChange(false) });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] lg:w-[520px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiUserAddLine className="size-5 text-primary" />
            Create Lead
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs">
                  Lead Name <span className="text-destructive">*</span>
                </Label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Prospect name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Lead Type *</Label>
                  <Select value={leadType} onValueChange={(v) => setLeadType(v as LeadType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Sub Type *</Label>
                  <Select value={subType} onValueChange={(v) => setSubType(v as CustomerSubType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUB_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Source *</Label>
                <Select
                  value={source}
                  onValueChange={(v) => {
                    setSource(v as LeadSource);
                    setReferrerCustomerId("");
                    setCustomerSearch("");
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {source === "referral" && (
                <div className="space-y-2">
                  <Label className="text-xs">
                    Referrer Customer <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={customerPickerOpen} onOpenChange={setCustomerPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className={selectedCustomer ? "text-foreground flex items-center gap-2" : "text-muted-foreground"}>
                          {selectedCustomer ? (
                            <>
                              {selectedCustomer.full_name}
                              <StatusBadge status={selectedCustomer.status} />
                            </>
                          ) : "Search customer…"}
                        </span>
                        <ChevronsUpDown className="size-4 opacity-50 shrink-0 ml-2" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search by name…"
                          value={customerSearch}
                          onValueChange={setCustomerSearch}
                        />
                        <CommandList>
                          {customersLoading && (
                            <div className="flex items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                              <Loader2 className="size-4 animate-spin" />
                              Loading…
                            </div>
                          )}
                          {!customersLoading && customerOptions.length === 0 && (
                            <CommandEmpty>No customers found.</CommandEmpty>
                          )}
                          {!customersLoading && customerOptions.length > 0 && (
                            <CommandGroup>
                              {customerOptions.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.id}
                                  onSelect={(val) => {
                                    setReferrerCustomerId(val === referrerCustomerId ? "" : val);
                                    setCustomerPickerOpen(false);
                                  }}
                                >
                                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium truncate">{c.full_name}</span>
                                      <StatusBadge status={c.status} />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono truncate">{c.id}</span>
                                  </div>
                                  {referrerCustomerId === c.id && (
                                    <Check className="size-4 text-primary shrink-0" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {referrerCustomerId && (
                    <p className="text-xs text-muted-foreground font-mono truncate">{referrerCustomerId}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs">
                  Branch <span className="text-destructive">*</span>
                </Label>
                <Select value={branchId} onValueChange={setBranchId} disabled={branchesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={branchesLoading ? "Loading…" : "Select branch"} />
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
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2 border-t p-5 pb-4 mt-auto justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit} className="font-semibold">
            {createLead.isPending ? "Creating…" : "Create Lead"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
