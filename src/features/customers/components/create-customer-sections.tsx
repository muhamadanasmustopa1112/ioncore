"use client";

import { useRef } from "react";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
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

const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "business", label: "Business" },
  { value: "enterprise", label: "Enterprise" },
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
  const fileRef = useRef<HTMLInputElement>(null);

  function clearInput() {
    if (fileRef.current) fileRef.current.value = "";
    onClearPhoto();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>Identity</SectionTitle>

        <FieldRow label="Customer Type" required>
          <Select value={customerType} onValueChange={(v) => setCustomerType(v as CustomerType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CUSTOMER_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Full Name" required>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name as on KTP" />
        </FieldRow>

        {needsCompany && (
          <FieldRow label="Company Name" required>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="PT / CV / UD" />
          </FieldRow>
        )}

        <FieldRow label="KTP Photo" required>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
            {ktpPreview ? (
              <div className="space-y-2">
                <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-border bg-muted">
                  <Image src={ktpPreview} alt="KTP preview" width={400} height={250} className="object-contain w-full" unoptimized />
                  {ktpScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        Scanning KTP…
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
                    Scanned
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
                  <p className="text-sm text-muted-foreground">Click to upload KTP photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP</p>
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

        <FieldRow label="NIK" required hint="Fill manually — OCR may not be accurate">
          <Input
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="3271xxxxxxxxxxxxxxxx"
            maxLength={16}
          />
        </FieldRow>

        <FieldRow label="KTP Address" hint="Address as printed on KTP">
          <Input value={ktpAddress} onChange={(e) => setKtpAddress(e.target.value)} placeholder="Same as or different from domicile" />
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
  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>Contact</SectionTitle>
        <FieldRow label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@email.com" />
        </FieldRow>
        <FieldRow label="Phone">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none shrink-0">
              +62
            </span>
            <Input
              className="rounded-l-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="812xxxxxxxx"
            />
          </div>
        </FieldRow>
        <FieldRow label="Address">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Domicile address" />
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
  return (
    <Card>
      <CardContent className="p-6">
        <SectionTitle>Assignment</SectionTitle>
        <FieldRow label="Branch">
          <Select value={branchId} onValueChange={setBranchId} disabled={branchesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={branchesLoading ? "Loading…" : "Select branch"} />
            </SelectTrigger>
            <SelectContent>
              {activeBranches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <span>{b.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">{b.level.replace("_", " ")}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Account Manager ID" hint="Optional — UUID">
          <Input
            value={accountManagerId}
            onChange={(e) => setAccountManagerId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            className="font-mono text-xs"
          />
        </FieldRow>
      </CardContent>
    </Card>
  );
}
