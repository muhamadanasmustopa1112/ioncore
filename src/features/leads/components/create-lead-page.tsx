"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useReferrerCustomers } from "@/features/customers/api/customers-queries";
import type { CustomerStatus } from "@/features/customers/types/customers-api";
import { InstallationSection, INSTALL_DEFAULT } from "@/features/customers/components/create-customer-installation-section";
import { paths } from "@/config/paths";
import { useUsers } from "@/features/user-service/api/users";
import { useCreateLead } from "../api/leads-queries";
import type { CustomerSubType, LeadSource, LeadStatus, LeadType } from "../types/leads-api";

const LEAD_TYPES: { value: LeadType; label: string }[] = [
  { value: "broadband", label: "Broadband" },
  { value: "enterprise", label: "Enterprise" },
];

const SUB_TYPES: { value: CustomerSubType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "business", label: "Business" },
];

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "potential", label: "Potential" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
  { value: "active", label: "Active" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const SOURCES: { value: LeadSource; label: string }[] = [
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold Call" },
  { value: "website", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "social_media_dm", label: "Social Media DM" },
  { value: "voip_call", label: "VoIP Call" },
  { value: "line_call", label: "Line Call" },
  { value: "walk_in", label: "Walk In" },
  { value: "event", label: "Event" },
  { value: "partner", label: "Partner" },
  { value: "cs_referral", label: "CS Referral" },
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

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function CreateLeadPage() {
  const router = useRouter();

  const [leadName, setLeadName] = useState("");
  const [leadType, setLeadType] = useState<LeadType>("broadband");
  const [subType, setSubType] = useState<CustomerSubType>("residential");
  const [source, setSource] = useState<LeadSource>("referral");
  const [status, setStatus] = useState<LeadStatus>("new");
  const [referrerCustomerId, setReferrerCustomerId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [nik, setNik] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lat, setLat] = useState(INSTALL_DEFAULT[0]);
  const [lng, setLng] = useState(INSTALL_DEFAULT[1]);
  const [covered, setCovered] = useState<boolean | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);

  const pinMoved = lat !== INSTALL_DEFAULT[0] || lng !== INSTALL_DEFAULT[1];

  const { data: branches = [], isLoading: branchesLoading } = useBranchList();
  const { data: customersData, isLoading: customersLoading } = useReferrerCustomers(
    source === "referral" ? { search: customerSearch || undefined, size: 20 } : {}
  );
  const [assignedSalesId, setAssignedSalesId] = useState("");
  const { data: usersResp, isLoading: usersLoading } = useUsers({ per_page: 500 });
  const usersList = useMemo(() => usersResp?.data ?? [], [usersResp]);
  const createLead = useCreateLead();

  const activeBranches = useMemo(() => branches.filter((b) => b.active && b.level === "area"), [branches]);

  const customerOptions = useMemo(
    () => (source === "referral" ? (customersData?.items ?? []) : []),
    [source, customersData],
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

  async function handleSubmit() {
    if (!canSubmit) return;
    if (covered !== true) {
      toast.error("Please check coverage at the installation point before creating the lead.");
      return;
    }
    try {
      await createLead.mutateAsync({
        lead_type: leadType,
        customer_sub_type: subType,
        lead_name: leadName.trim(),
        source,
        branch_id: branchId,
        referrer_customer_id: source === "referral" && referrerCustomerId ? referrerCustomerId : null,
        assigned_sales_id: "91fce6ad-f5a2-484d-9aac-03ca4db2e7c5",
        status,
        ...(nik.trim() ? { nik: nik.trim() } : {}),
        ...(phoneNumber.trim() ? { phone_number: phoneNumber.trim() } : {}),
        ...(pinMoved ? { latitude: lat, longitude: lng } : {}),
      });
      router.push(paths.dashboard.crmAndSales.leads.root.getHref());
    } catch (err) {
      toast.error((err as any)?.response?.data?.error ?? (err as any)?.response?.data?.message ?? "Failed to create lead");
    }
  }

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <Toolbar>
          <ToolbarHeading>
            <PageBreadcrumb
              items={[
                { title: "CRM & Sales", path: paths.dashboard.crmAndSales.root.getHref() },
                { title: "Leads", path: paths.dashboard.crmAndSales.leads.root.getHref() },
                { title: "Create Lead" },
              ]}
            />
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight mt-1">
              Create Lead
            </ToolbarTitle>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" onClick={() => router.back()} size="sm" disabled={createLead.isPending}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>

      <div className="px-6 py-4 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lead Info</p>

              <FieldRow label="Lead Name" required>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Prospect name"
                />
              </FieldRow>

              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Lead Type" required>
                  <Select value={leadType} onValueChange={(v) => setLeadType(v as LeadType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="Sub Type" required>
                  <Select value={subType} onValueChange={(v) => setSubType(v as CustomerSubType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUB_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>

              <FieldRow label="Source" required>
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
              </FieldRow>

              {source === "referral" && (
                <FieldRow label="Referrer Customer" required>
                  <Popover open={customerPickerOpen} onOpenChange={setCustomerPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <span className={selectedCustomer ? "text-foreground flex items-center gap-2" : "text-muted-foreground"}>
                          {selectedCustomer ? (
                            <>{selectedCustomer.full_name}<StatusBadge status={selectedCustomer.status} /></>
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
                              <Loader2 className="size-4 animate-spin" /> Loading…
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
                    <p className="text-xs text-muted-foreground font-mono truncate mt-1">{referrerCustomerId}</p>
                  )}
                </FieldRow>
              )}

              <FieldRow label="Branch" required>
                <Select
                  value={branchId}
                  onValueChange={setBranchId}
                  disabled={branchesLoading}
                >
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
              </FieldRow>

              <FieldRow label="Assigned Sales">
                <Select
                  value={assignedSalesId}
                  onValueChange={setAssignedSalesId}
                  disabled={usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        usersLoading
                          ? "Loading users..."
                          : "Select user"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {usersList.length === 0 ? (
                      <SelectItem value="no-users" disabled>
                        No users available
                      </SelectItem>
                    ) : (
                      usersList.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="Status" required>
                <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="NIK">
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="16-digit NIK"
                    maxLength={16}
                  />
                </FieldRow>
                <FieldRow label="Phone Number">
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+62812..."
                    type="tel"
                  />
                </FieldRow>
              </div>
            </CardContent>
          </Card>

          <InstallationSection
            lat={lat}
            lng={lng}
            onLatLngChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }}
            onAddressChange={() => { }}
            onCoverageChange={setCovered}
          />
        </div>

        <div className="space-y-4 xl:sticky xl:top-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold">Summary</p>
              <div className="text-sm space-y-2 divide-y divide-border/40">
                {([
                  { label: "Type", value: `${leadType} · ${subType}` },
                  { label: "Name", value: leadName || null },
                  { label: "NIK", value: nik || null },
                  { label: "Source", value: source.replace("_", " ") },
                  { label: "Status", value: STATUSES.find((s) => s.value === status)?.label ?? status },
                  { label: "Branch", value: activeBranches.find((b) => b.id === branchId)?.name ?? null },
                  { label: "Assigned Sales", value: usersList.find((u) => u.id === assignedSalesId)?.name ?? null },
                  { label: "Referrer", value: selectedCustomer?.full_name ?? null },
                  { label: "Coords", value: pinMoved ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : null },
                ] as { label: string; value: string | null }[]).map(({ label, value }) => value ? (
                  <div key={label} className="flex justify-between py-1.5 first:pt-0">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="font-medium text-right truncate max-w-[160px] ml-2 capitalize">{value}</span>
                  </div>
                ) : null)}
              </div>

              <div className="space-y-2 pt-1">
                <Button variant="primary" className="w-full font-semibold" onClick={handleSubmit} disabled={!canSubmit}>
                  {createLead.isPending ? <><Loader2 className="size-4 animate-spin" /> Creating…</> : "Create Lead"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={createLead.isPending}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
