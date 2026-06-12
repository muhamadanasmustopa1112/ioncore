"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useBranchScope } from "@/hooks/use-branch-scope";
import { BranchCombobox } from "@/features/administration/branch/components/branch-combobox";
import { InstallationSection, INSTALL_DEFAULT } from "@/features/customers/components/create-customer-installation-section";
import { useReferrerCustomers } from "@/features/customers/api/customers-queries";
import type { CustomerStatus } from "@/features/customers/types/customers-api";
import { useCreateLead, useSalesAdminUsers } from "../api/leads-queries";
import type {
  CreateLeadPayload,
  CustomerSubType,
  LeadSource,
  LeadType,
} from "../types/leads-api";
import { getPrimaryBranchIdFromMeUser } from "../utils/sales-admin-branch";

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

function resetState() {
  return {
    leadName: "",
    leadType: "broadband" as LeadType,
    subType: "residential" as CustomerSubType,
    source: "referral" as LeadSource,
    referrerCustomerId: "",
    branchId: "",
    assignedSalesId: "",
    nik: "",
    lat: INSTALL_DEFAULT[0],
    lng: INSTALL_DEFAULT[1],
  };
}

export function CreateLeadSheet({ open, onClose }: Props) {
  const { t } = useTranslation();
  const initial = resetState();
  const [leadName, setLeadName] = useState(initial.leadName);
  const [leadType, setLeadType] = useState<LeadType>(initial.leadType);
  const [subType, setSubType] = useState<CustomerSubType>(initial.subType);
  const [source, setSource] = useState<LeadSource>(initial.source);
  const [referrerCustomerId, setReferrerCustomerId] = useState(initial.referrerCustomerId);
  const [branchId, setBranchId] = useState(initial.branchId);
  const [assignedSalesId, setAssignedSalesId] = useState(initial.assignedSalesId);
  const [nik, setNik] = useState(initial.nik);
  const [lat, setLat] = useState(initial.lat);
  const [lng, setLng] = useState(initial.lng);
  const pinMoved = lat !== INSTALL_DEFAULT[0] || lng !== INSTALL_DEFAULT[1];
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [branchType, setBranchType] = useState("all");
  const [search, setSearch] = useState("");

  const { isBranchScoped, meUser } = useBranchScope("lead");
  const salesAdminBranchId = useMemo(
    () => getPrimaryBranchIdFromMeUser(meUser),
    [meUser],
  );

  const { data: branches = [], isLoading: branchesLoading } = useBranchList({
    branch_type: branchType === "all" ? undefined : branchType,
    keyword: search || undefined,
  });
  const { data: customersData, isLoading: customersLoading } = useReferrerCustomers(
    source === "referral" ? { search: customerSearch || undefined, size: 500, status: "active" } : {}
  );
  const createLead = useCreateLead();
  const effectiveBranchId = isBranchScoped ? salesAdminBranchId : branchId;
  const { users: salesAdminUsers, isLoading: salesAdminsLoading } = useSalesAdminUsers(
    effectiveBranchId || undefined,
  );

  useEffect(() => {
    if (!isBranchScoped) return;
    setBranchId(salesAdminBranchId);
    if (!salesAdminBranchId) {
      setAssignedSalesId("");
    }
  }, [isBranchScoped, salesAdminBranchId]);

  const activeBranches = useMemo(
    () => branches.filter((b) => {
      if (!b.active || (b.level !== "area" && b.level !== "sub_area")) return false;
      return true;
    }),
    [branches]
  );

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
    !!effectiveBranchId &&
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
      setAssignedSalesId(s.assignedSalesId);
      setNik(s.nik);
      setLat(s.lat);
      setLng(s.lng);
      setCustomerSearch("");
      setCustomerPickerOpen(false);
      setSearch("");
      setBranchType("all");
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
      branch_id: effectiveBranchId,
      referrer_customer_id:
        source === "referral" && referrerCustomerId ? referrerCustomerId : null,
      status: "new",
      ...(nik.trim() ? { nik: nik.trim() } : {}),
      ...(pinMoved ? { latitude: lat, longitude: lng } : {}),
      ...(assignedSalesId ? { assigned_sales_id: assignedSalesId } : {}),
    };
    createLead.mutate(payload, { onSuccess: () => handleOpenChange(false) });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] lg:w-[520px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiUserAddLine className="size-5 text-primary" />
            {t("leads.createLead")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("leads.leadName", "Lead Name")} <span className="text-destructive">*</span>
                </Label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder={t("leads.prospectNamePlaceholder", "Prospect name")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">{t("leads.leadType", "Lead Type")} *</Label>
                  <Select value={leadType} onValueChange={(v) => setLeadType(v as LeadType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broadband">{t("leads.types.broadband", "Broadband")}</SelectItem>
                      <SelectItem value="enterprise">{t("leads.types.enterprise", "Enterprise")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">{t("leads.subType", "Sub Type")} *</Label>
                  <Select value={subType} onValueChange={(v) => setSubType(v as CustomerSubType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">{t("customers.residential")}</SelectItem>
                      <SelectItem value="business">{t("customers.business")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">{t("customers.source")} *</Label>
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
                    <SelectItem value="referral">{t("customers.sources.referral")}</SelectItem>
                    <SelectItem value="cold_call">{t("customers.sources.coldCall")}</SelectItem>
                    <SelectItem value="website">{t("customers.sources.website")}</SelectItem>
                    <SelectItem value="whatsapp">{t("customers.sources.whatsapp")}</SelectItem>
                    <SelectItem value="social_media_dm">{t("customers.sources.socialMediaDm")}</SelectItem>
                    <SelectItem value="voip_call">{t("customers.sources.voipCall")}</SelectItem>
                    <SelectItem value="line_call">{t("customers.sources.lineCall")}</SelectItem>
                    <SelectItem value="walk_in">{t("customers.sources.walkIn")}</SelectItem>
                    <SelectItem value="event">{t("customers.sources.event")}</SelectItem>
                    <SelectItem value="partner">{t("customers.sources.partner")}</SelectItem>
                    <SelectItem value="cs_referral">{t("customers.sources.csReferral")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {source === "referral" && (
                <div className="space-y-2">
                  <Label className="text-xs">
                    {t("customers.referrerCustomer")} <span className="text-destructive">*</span>
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
                          ) : t("customers.searchCustomer")}
                        </span>
                        <ChevronsUpDown className="size-4 opacity-50 shrink-0 ml-2" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder={t("customers.searchByName")}
                          value={customerSearch}
                          onValueChange={setCustomerSearch}
                        />
                        <CommandList>
                          {customersLoading && (
                            <div className="flex items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                              <Loader2 className="size-4 animate-spin" />
                              {t("common.loading")}
                            </div>
                          )}
                          {!customersLoading && customerOptions.length === 0 && (
                            <CommandEmpty>{t("customers.noCustomerFound")}</CommandEmpty>
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
                <Label className="text-xs">{t("customers.nik")}</Label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder={t("customers.nikPlaceholder")}
                  maxLength={16}
                />
              </div>

              <InstallationSection
                lat={lat}
                lng={lng}
                onLatLngChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }}
                onAddressChange={() => { }}
              />

              {!isBranchScoped && (
                <div className="space-y-2">
                  <Label className="text-xs">
                    {t("customers.branch")} <span className="text-destructive">*</span>
                  </Label>
                  <BranchCombobox
                    branches={activeBranches}
                    value={branchId}
                    onValueChange={(v) => {
                      setBranchId(v);
                      setAssignedSalesId("");
                    }}
                    branchType={branchType}
                    onTypeChange={setBranchType}
                    onSearchChange={setSearch}
                    isLoading={branchesLoading}
                    className="w-full"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs">{t("leads.assignedSales", "Assigned Sales")}</Label>
                <Select
                  value={assignedSalesId || "none"}
                  onValueChange={(v) => setAssignedSalesId(v === "none" ? "" : v)}
                  disabled={!effectiveBranchId || salesAdminsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !effectiveBranchId
                          ? t("leads.selectBranchFirst", "Select branch first")
                          : salesAdminsLoading
                            ? t("common.loading")
                            : t("leads.selectAssignedSales", "Select sales admin")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("leads.noAssignedSales", "Not assigned")}</SelectItem>
                    {salesAdminUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2 border-t p-5 pb-4 mt-auto justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>{t("common.cancel")}</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit} className="font-semibold">
            {createLead.isPending ? t("common.creating") : t("leads.createLead")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
