"use client";

import { useRef, useState, useMemo } from "react";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerType } from "../types/customers-api";
import type { BranchData } from "@/features/administration/branch/types/branch";
import { BranchCombobox } from "@/features/administration/branch/components/branch-combobox";
import "@/i18n";

const CUSTOMER_TYPES = (t: (key: string) => string): { value: CustomerType; label: string }[] => [
  { value: "residential", label: t("customers.residential") },
  { value: "business", label: t("customers.business") },
  { value: "enterprise", label: t("customers.enterprise") },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </p>
  );
}

function FieldRow({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[200px_1fr] items-start gap-4 py-3.5 border-b border-border/40 last:border-0">
      <div className="pt-2.5">
        <Label className="text-sm font-medium">
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export interface IdentitySectionProps {
  // personal
  customerType: CustomerType;
  setCustomerType: (v: CustomerType) => void;
  fullName: string;
  setFullName: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  needsCompany: boolean;
  // ktp
  nik: string;
  setNik: (v: string) => void;
  ktpAddress: string;
  setKtpAddress: (v: string) => void;
  ktpPreview: string | null;
  ktpScanning: boolean;
  ktpFileSelected: boolean;
  ktpError: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPhoto: () => void;
}

export function IdentitySection({
  customerType, setCustomerType,
  fullName, setFullName,
  companyName, setCompanyName,
  needsCompany,
  nik, setNik,
  ktpAddress, setKtpAddress,
  ktpPreview, ktpScanning, ktpFileSelected, ktpError,
  onFileChange, onClearPhoto,
}: IdentitySectionProps) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);

  function clearInput() {
    if (fileRef.current) fileRef.current.value = "";
    onClearPhoto();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>{t("customers.identity")}</SectionTitle>

        <FieldRow label={t("customers.customerType")} required>
          <Select value={customerType} onValueChange={(v) => setCustomerType(v as CustomerType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CUSTOMER_TYPES(t).map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label={t("customers.fullName")} required>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("customers.fullNamePlaceholder")} />
        </FieldRow>

        {needsCompany && (
          <FieldRow label={t("customers.companyName")} required>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t("customers.companyPlaceholder")} />
          </FieldRow>
        )}

        <FieldRow label={t("customers.ktpPhoto")} required>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
            {ktpPreview ? (
              <div className="space-y-2">
                <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-border bg-muted">
                  <Image src={ktpPreview} alt="KTP preview" width={400} height={250} className="object-contain w-full" unoptimized />
                  {ktpScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        {t("customers.scanning")}
                      </div>
                    </div>
                  )}
                  {!ktpScanning && (
                    <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 w-7 p-0" onClick={clearInput} type="button">
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
                {ktpFileSelected && !ktpScanning && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-success" />
                    {t("customers.scanned")}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => !ktpScanning && fileRef.current?.click()}
                className="flex flex-col items-center justify-center w-full max-w-sm h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer gap-3"
              >
                <Upload className="size-7 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t("customers.ktpUpload")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("customers.ktpFormats")}</p>
                </div>
              </button>
            )}
            {ktpError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">{ktpError}</AlertDescription>
              </Alert>
            )}
          </FieldRow>

        <FieldRow label={t("customers.nik")} required hint={t("customers.nikHint")}>
          <Input
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder={t("customers.nikPlaceholder")}
            maxLength={16}
          />
        </FieldRow>

        <FieldRow label={t("customers.ktpAddress")} hint={t("customers.ktpAddressHint")}>
          <Input value={ktpAddress} onChange={(e) => setKtpAddress(e.target.value)} placeholder={t("customers.ktpAddressPlaceholder")} />
        </FieldRow>

      </CardContent>
    </Card>
  );
}

export interface ContactSectionProps {
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  address: string; setAddress: (v: string) => void;
}

export function ContactSection({ email, setEmail, phone, setPhone, address, setAddress }: ContactSectionProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>{t("customers.contact")}</SectionTitle>
        <FieldRow label={t("common.email")}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("customers.emailPlaceholder")} />
        </FieldRow>
        <FieldRow label={t("common.phone")}>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none shrink-0">
              +62
            </span>
            <Input
              className="rounded-l-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("customers.phonePlaceholder")}
            />
          </div>
        </FieldRow>
        <FieldRow label={t("common.address")}>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("customers.domicileAddress")} />
        </FieldRow>
      </CardContent>
    </Card>
  );
}

export interface AssignmentSectionProps {
  branchId: string;
  setBranchId: (v: string) => void;
  accountManagerId: string;
  setAccountManagerId: (v: string) => void;
  activeBranches: BranchData[];
  branchesLoading: boolean;
}

export function AssignmentSection({ branchId, setBranchId, accountManagerId, setAccountManagerId, activeBranches, branchesLoading }: AssignmentSectionProps) {
  const { t } = useTranslation();
  const [branchType, setBranchType] = useState("all");
  const filteredBranches = useMemo(
    () => branchType === "all" ? activeBranches : activeBranches.filter((b) => b.branchType === branchType),
    [activeBranches, branchType]
  );

  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>{t("customers.assignment")}</SectionTitle>
        <FieldRow label={t("customers.branch")} required>
          <BranchCombobox
            branches={filteredBranches}
            value={branchId}
            onValueChange={setBranchId}
            branchType={branchType}
            onTypeChange={setBranchType}
            isLoading={branchesLoading}
            className="w-full"
          />
        </FieldRow>
        <FieldRow label={t("customers.accountManagerId")} hint={t("customers.accountManagerHint")}>
          <Input
            value={accountManagerId}
            onChange={(e) => setAccountManagerId(e.target.value)}
            placeholder={t("customers.accountManagerPlaceholder")}
            className="font-mono text-xs"
          />
        </FieldRow>
      </CardContent>
    </Card>
  );
}
