"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { createLead } from "@/features/leads/api/leads-api";
import { uploadImageToS3 } from "@/lib/s3-upload";
import { paths } from "@/config/paths";
import { useCreateCustomer } from "../api/customers-queries";
import type { CreateCustomerPayload, CustomerType } from "../types/customers-api";
import {
  AssignmentSection,
  ContactSection,
  IdentitySection,
} from "./create-customer-sections";
import { InstallationSection, INSTALL_DEFAULT } from "./create-customer-installation-section";


function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  return `+62${digits}`;
}

export function CreateCustomer() {
  const router = useRouter();

  const [customerType, setCustomerType] = useState<CustomerType>("residential");
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accountManagerId, setAccountManagerId] = useState("");

  const ktpEntryMode = "ocr" as const;
  const [ktpAddress, setKtpAddress] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [ktpScanning, setKtpScanning] = useState(false);
  const [ktpError, setKtpError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [ktpUploadedUrl, setKtpUploadedUrl] = useState<string | null>(null);

  const [installLat, setInstallLat] = useState(INSTALL_DEFAULT[0]);
  const [installLng, setInstallLng] = useState(INSTALL_DEFAULT[1]);
  const [covered, setCovered] = useState<boolean | null>(null);
  const installMoved =
    installLat !== INSTALL_DEFAULT[0] || installLng !== INSTALL_DEFAULT[1];

  const { data: branches = [], isLoading: branchesLoading } = useBranchList({ level: "sub_area" });
  const createCustomer = useCreateCustomer();

  const activeBranches = branches.filter((b) => b.active);
  const needsCompany = customerType !== "residential";
  const isBusy = isUploading || createCustomer.isPending;

  const canSubmit =
    !!fullName.trim() &&
    !!branchId &&
    !isBusy &&
    !ktpScanning &&
    !!ktpFile;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setKtpError(null);
    setKtpFile(null);
    setKtpPreview(null);
    setKtpUploadedUrl(null);
    setKtpScanning(true);

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });
    setKtpPreview(dataUrl);
    setKtpFile(file);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      try {
        const { data } = await worker.recognize(dataUrl);
        const raw = data.text;

        const nameMatch = raw.match(/Nama\s*[:\-]?\s*(.+)/i);
        if (nameMatch && !fullName.trim()) setFullName(nameMatch[1].trim());

        const addressMatch = raw.match(/Alamat\s*[:\-]?\s*(.+)/i);
        if (addressMatch) {
          const extractedAddr = addressMatch[1].trim();
          if (!ktpAddress.trim()) setKtpAddress(extractedAddr);
          if (!address.trim()) setAddress(extractedAddr);
        }
      } finally {
        await worker.terminate();
      }
    } catch {
      // OCR failure is non-blocking — user fills manually
    } finally {
      setKtpScanning(false);
    }
  }

  function clearPhoto() {
    setKtpFile(null);
    setKtpPreview(null);
    setKtpError(null);
    setKtpUploadedUrl(null);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    if (covered !== true) {
      toast.error("Please check coverage at the installation point before creating the customer.");
      return;
    }

    let ktpPhotoUrl: string | undefined;
    if (ktpEntryMode === "ocr" && ktpFile) {
      if (ktpUploadedUrl) {
        ktpPhotoUrl = ktpUploadedUrl;
      } else {
        setIsUploading(true);
        try {
          const { url } = await uploadImageToS3(ktpFile);
          ktpPhotoUrl = url;
          setKtpUploadedUrl(url);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "KTP upload failed");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
    }

    try {
      // Create lead first to get lead_id
      let leadId: string | undefined;
      if (branchId) {
        try {
          const leadRes = await createLead({
            lead_type: "broadband",
            customer_sub_type: customerType === "residential" ? "residential" : "business",
            lead_name: fullName.trim(),
            source: "other",
            branch_id: branchId,
            referrer_customer_id: null,
            status: "converted",
            ...(nik.trim() ? { nik: nik.trim() } : {}),
            ...(installMoved ? { latitude: installLat, longitude: installLng } : {}),
          });
          leadId = (leadRes as any)?.data?.id;
        } catch {
          // non-blocking — customer creation proceeds even if lead fails
        }
      }

      const payload: CreateCustomerPayload = {
        customer_type: customerType,
        full_name: fullName.trim(),
        ...(branchId ? { branch_id: branchId } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(phone.trim() ? { phone: formatPhone(phone.trim()) } : {}),
        ...(nik.trim() ? { nik: nik.trim() } : {}),
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(ktpAddress.trim() ? { ktp_address: ktpAddress.trim() } : {}),
        ktp_entry_mode: ktpEntryMode,
        ...(ktpPhotoUrl ? { ktp_photo_url: ktpPhotoUrl } : {}),
        ...(needsCompany && companyName.trim() ? { company_name: companyName.trim() } : {}),
        ...(accountManagerId.trim() ? { account_manager_id: accountManagerId.trim() } : {}),
        ...(leadId ? { lead_id: leadId } : {}),
        ...(installMoved ? { lat: installLat, lon: installLng } : {}),
      };

      await createCustomer.mutateAsync(payload);
      router.push(paths.dashboard.crmAndSales.customer.root.getHref());
    } catch (err) {
      toast.error((err as any)?.response?.data?.error ?? (err as any)?.response?.data?.message ?? "Failed to create customer");
    }
  }

  const submitLabel = isUploading
    ? <><Loader2 className="size-4 animate-spin" /> Uploading KTP…</>
    : createCustomer.isPending
      ? <><Loader2 className="size-4 animate-spin" /> Creating…</>
      : "Create Customer";

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <Toolbar>
          <ToolbarHeading>
            <PageBreadcrumb
              items={[
                { title: "CRM & Sales", path: paths.dashboard.crmAndSales.root.getHref() },
                { title: "Customers", path: paths.dashboard.crmAndSales.customer.root.getHref() },
                { title: "Create Customer" },
              ]}
            />
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight mt-1">
              Create Customer
            </ToolbarTitle>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" onClick={() => router.back()} size="sm" disabled={isBusy}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>

      <div className="px-6 py-4 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-5">
          <IdentitySection
            customerType={customerType} setCustomerType={setCustomerType}
            fullName={fullName} setFullName={setFullName}
            companyName={companyName} setCompanyName={setCompanyName}
            needsCompany={needsCompany}

            nik={nik} setNik={setNik}
            ktpAddress={ktpAddress} setKtpAddress={setKtpAddress}
            ktpPreview={ktpPreview} ktpScanning={ktpScanning}
            ktpFileSelected={!!ktpFile} ktpError={ktpError}
            onFileChange={handleFileChange} onClearPhoto={clearPhoto}
          />
          <ContactSection
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone}
            address={address} setAddress={setAddress}
          />
          <AssignmentSection
            branchId={branchId} setBranchId={setBranchId}
            accountManagerId={accountManagerId} setAccountManagerId={setAccountManagerId}
            activeBranches={activeBranches} branchesLoading={branchesLoading}
          />
          <InstallationSection
            lat={installLat}
            lng={installLng}
            onLatLngChange={(lat, lng) => { setInstallLat(lat); setInstallLng(lng); }}
            onAddressChange={() => {}}
            onCoverageChange={setCovered}
          />
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4 xl:sticky xl:top-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold">Summary</p>
              <div className="text-sm space-y-2 divide-y divide-border/40">
                {([
                  { label: "Type", value: customerType },
                  { label: "Name", value: fullName || null },
                  { label: "NIK", value: nik || null },
                  { label: "Email", value: email || null },
                  { label: "Phone", value: phone || null },
                  { label: "Branch", value: activeBranches.find((b) => b.id === branchId)?.name ?? null },
                  { label: "KTP photo", value: ktpFile ? (ktpScanning ? "Scanning…" : "✓ Ready") : null },
                ] as { label: string; value: string | null }[]).map(({ label, value }) => value ? (
                  <div key={label} className="flex justify-between py-1.5 first:pt-0">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="font-medium text-right truncate max-w-[160px] ml-2">{value}</span>
                  </div>
                ) : null)}
              </div>

<div className="space-y-2 pt-1">
                <Button variant="primary" className="w-full font-semibold" onClick={handleSubmit} disabled={!canSubmit}>
                  {submitLabel}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={isBusy}>
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
