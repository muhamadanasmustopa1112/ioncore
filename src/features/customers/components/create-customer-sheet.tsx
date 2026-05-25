"use client";

import { useEffect, useState } from "react";
import { RiUserAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useCreateCustomer } from "../api/customers-queries";
import type { CreateCustomerPayload, CustomerType } from "../types/customers-api";
import "@/i18n";

const TYPES = (t: (key: string) => string): { value: CustomerType; label: string }[] => [
  { value: "residential", label: t("customers.residential") },
  { value: "business", label: t("customers.business") },
  { value: "enterprise", label: t("customers.enterprise") },
];

const EMPTY = {
  customerType: "residential" as CustomerType,
  fullName: "",
  companyName: "",
  branchId: "",
  accountManagerId: "",
  onboardingSchemaVersionId: "",
  billingSchemaVersionId: "",
  serviceSchemaVersionId: "",
  commissionSchemaVersionId: "",
  suspensionSchemaVersionId: "",
  ktp_entry_mode: 'ocr' as const,
};

export function CreateCustomerSheet({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);

  const { data: branches = [], isLoading: branchesLoading } = useBranchList({ level: "sub_area" });
  const createCustomer = useCreateCustomer();

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!open) setForm(EMPTY);
  }, [open]);

  const activeBranches = branches.filter((b) => b.active);
  const needsCompany = form.customerType !== "residential";
  const canSubmit =
    form.fullName.trim() &&
    form.branchId &&
    !createCustomer.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload: CreateCustomerPayload = {
      customer_type: form.customerType,
      full_name: form.fullName.trim(),
      branch_id: form.branchId,
      ...(form.companyName.trim() ? { company_name: form.companyName.trim() } : {}),
      ...(form.accountManagerId.trim() ? { account_manager_id: form.accountManagerId.trim() } : {}),
      ...(form.onboardingSchemaVersionId.trim() ? { onboarding_schema_version_id: form.onboardingSchemaVersionId.trim() } : {}),
      ...(form.billingSchemaVersionId.trim() ? { billing_schema_version_id: form.billingSchemaVersionId.trim() } : {}),
      ...(form.serviceSchemaVersionId.trim() ? { service_schema_version_id: form.serviceSchemaVersionId.trim() } : {}),
      ...(form.commissionSchemaVersionId.trim() ? { commission_schema_version_id: form.commissionSchemaVersionId.trim() } : {}),
      ...(form.suspensionSchemaVersionId.trim() ? { suspension_schema_version_id: form.suspensionSchemaVersionId.trim() } : {}),
      ktp_entry_mode: form?.ktp_entry_mode || 'ocr'
    };
    createCustomer.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiUserAddLine className="size-5 text-primary" />
            {t("customers.createCustomer")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-6">
            <div className="space-y-5">
              {/* ── Core fields ── */}
              <div className="space-y-2">
                <Label className="text-xs">{t("customers.customerType")} *</Label>
                <Select value={form.customerType} onValueChange={set("customerType")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES(t).map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  {t("customers.fullName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => set("fullName")(e.target.value)}
                  placeholder={t("customers.fullNamePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  {t("customers.companyName")} {needsCompany && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => set("companyName")(e.target.value)}
                  placeholder={t("customers.companyPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  {t("customers.branch")} <span className="text-destructive">*</span>
                </Label>
                <Select value={form.branchId} onValueChange={set("branchId")} disabled={branchesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={branchesLoading ? t("common.loading") : t("customers.selectBranch")} />
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

              <div className="space-y-2">
                <Label className="text-xs">{t("customers.accountManagerId")}</Label>
                <Input
                  value={form.accountManagerId}
                  onChange={(e) => set("accountManagerId")(e.target.value)}
                  placeholder={t("customers.uuidOptional")}
                />
              </div>

              {/* ── Schema version IDs ── */}
              <div className="border-t pt-4 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("customers.schemaVersions")}</p>

                <div className="space-y-2">
                  <Label className="text-xs">{t("customers.onboardingSchema")}</Label>
                  <Input
                    value={form.onboardingSchemaVersionId}
                    onChange={(e) => set("onboardingSchemaVersionId")(e.target.value)}
                    placeholder={t("customers.uuidPlaceholder")}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">{t("customers.billingSchema")}</Label>
                  <Input
                    value={form.billingSchemaVersionId}
                    onChange={(e) => set("billingSchemaVersionId")(e.target.value)}
                    placeholder={t("customers.uuidPlaceholder")}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">{t("customers.serviceSchema")}</Label>
                  <Input
                    value={form.serviceSchemaVersionId}
                    onChange={(e) => set("serviceSchemaVersionId")(e.target.value)}
                    placeholder={t("customers.uuidPlaceholder")}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">{t("customers.commissionSchema")}</Label>
                  <Input
                    value={form.commissionSchemaVersionId}
                    onChange={(e) => set("commissionSchemaVersionId")(e.target.value)}
                    placeholder={t("customers.uuidPlaceholder")}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">{t("customers.suspensionSchema")}</Label>
                  <Input
                    value={form.suspensionSchemaVersionId}
                    onChange={(e) => set("suspensionSchemaVersionId")(e.target.value)}
                    placeholder={t("customers.uuidPlaceholder")}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2 border-t p-5 pb-4 mt-auto justify-end">
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit} className="font-semibold">
            {createCustomer.isPending ? t("customers.creating") : t("customers.createCustomer")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
