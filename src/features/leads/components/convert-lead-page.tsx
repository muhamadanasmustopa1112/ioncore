"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useLead } from "../api/leads-queries";
import { uploadImageToS3 } from "@/lib/s3-upload";
import { paths } from "@/config/paths";
import { useCreateCustomerFromLead } from "@/features/customers/api/customers-queries";
import type { CustomerType } from "@/features/customers/types/customers-api";
import {
  IdentitySection,
  ContactSection,
  AssignmentSection,
} from "@/features/customers/components/create-customer-sections";
import { InstallationSection, INSTALL_DEFAULT } from "@/features/customers/components/create-customer-installation-section";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  return `+62${digits}`;
}

export function ConvertLeadPage() {
  const params = useParams<{ id: string }>();
  const leadId = params?.id ?? "";
  const router = useRouter();

  const { data: lead, isLoading: leadLoading } = useLead(leadId);
  const { data: branches = [], isLoading: branchesLoading } = useBranchList({ level: "sub_area" });
  const createCustomerFromLead = useCreateCustomerFromLead();

  const [customerType, setCustomerType] = useState<CustomerType>("residential");
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accountManagerId, setAccountManagerId] = useState("");
  const [ktpAddress, setKtpAddress] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [ktpScanning, setKtpScanning] = useState(false);
  const [ktpError, setKtpError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [installLat, setInstallLat] = useState(INSTALL_DEFAULT[0]);
  const [installLng, setInstallLng] = useState(INSTALL_DEFAULT[1]);
  const [covered, setCovered] = useState<boolean | null>(null);
  const pinMoved = installLat !== INSTALL_DEFAULT[0] || installLng !== INSTALL_DEFAULT[1];

  useEffect(() => {
    if (!lead) return;
    setFullName(lead.lead_name);
    setBranchId(lead.branch_id);
    setCustomerType(lead.customer_sub_type === "residential" ? "residential" : "business");
    if (lead.installation_point_lat && lead.installation_point_lng) {
      setInstallLat(lead.installation_point_lat);
      setInstallLng(lead.installation_point_lng);
      setCovered(true); // coords already validated at lead creation
    }
  }, [lead]);

  const activeBranches = branches.filter((b) => b.active);
  const needsCompany = customerType !== "residential";
  const isBusy = isUploading || createCustomerFromLead.isPending;
  const canSubmit = !!fullName.trim() && !isBusy && !ktpScanning && !!ktpFile;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setKtpError(null);
    setKtpFile(null);
    setKtpPreview(null);
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
          const extracted = addressMatch[1].trim();
          if (!ktpAddress.trim()) setKtpAddress(extracted);
          if (!address.trim()) setAddress(extracted);
        }
      } finally {
        await worker.terminate();
      }
    } catch {
      // non-blocking
    } finally {
      setKtpScanning(false);
    }
  }

  function clearPhoto() {
    setKtpFile(null);
    setKtpPreview(null);
    setKtpError(null);
  }

  async function handleSubmit() {
    if (!canSubmit || !lead) return;
    if (covered !== true) {
      toast.error("Please check coverage at the installation point before converting the lead.");
      return;
    }

    let ktpPhotoUrl: string | undefined;
    if (ktpFile) {
      setIsUploading(true);
      try {
        const { url } = await uploadImageToS3(ktpFile);
        ktpPhotoUrl = url;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "KTP upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    try {
      const res = await createCustomerFromLead.mutateAsync({
        lead_id: leadId,
        customer_type: customerType,
        full_name: fullName.trim(),
        ...(branchId ? { branch_id: branchId } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(phone.trim() ? { phone: formatPhone(phone.trim()) } : {}),
        ...(nik.trim() ? { nik: nik.trim() } : {}),
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(ktpAddress.trim() ? { ktp_address: ktpAddress.trim() } : {}),
        ktp_entry_mode: "ocr",
        ...(ktpPhotoUrl ? { ktp_photo_url: ktpPhotoUrl } : {}),
        ...(needsCompany && companyName.trim() ? { company_name: companyName.trim() } : {}),
        ...(accountManagerId.trim() ? { account_manager_id: accountManagerId.trim() } : {}),
        ...(pinMoved ? { lat: installLat, lon: installLng } : {}),
      });

      const customerId = (res as any)?.data?.id;
      router.push(paths.dashboard.crmAndSales.customer.detail.getHref(customerId));
    } catch (err) {
      toast.error((err as any)?.response?.data?.error ?? (err as any)?.response?.data?.message ?? "Failed to create customer");
    }
  }

  if (leadLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" /> Loading lead…
      </div>
    );
  }
  if (!lead) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Lead not found</div>;
  }

  const submitLabel = isUploading
    ? <><Loader2 className="size-4 animate-spin" /> Uploading KTP…</>
    : createCustomerFromLead.isPending
      ? <><Loader2 className="size-4 animate-spin" /> Creating…</>
      : "Convert to Customer";

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <Toolbar>
          <ToolbarHeading>
            <PageBreadcrumb
              items={[
                { title: "CRM & Sales", path: paths.dashboard.crmAndSales.root.getHref() },
                { title: "Leads", path: paths.dashboard.crmAndSales.leads.root.getHref() },
                { title: lead.lead_name, path: paths.dashboard.crmAndSales.leads.detail.getHref(leadId) },
                { title: "Convert to Customer" },
              ]}
            />
            <ToolbarTitle className="text-2xl font-extrabold tracking-tight mt-1">
              Convert Lead to Customer
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
          {/* Lead context */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Lead</p>
                <p className="font-semibold">{lead.lead_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                <Badge variant="secondary" size="sm" className="capitalize">{lead.lead_type} · {lead.customer_sub_type}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Source</p>
                <p className="capitalize">{lead.source.replace("_", " ")}</p>
              </div>
              {lead.installation_point_lat && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Installation coords</p>
                  <p className="font-mono text-xs">{lead.installation_point_lat.toFixed(4)}, {lead.installation_point_lng?.toFixed(4)}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                  { label: "Coords", value: pinMoved ? `${installLat.toFixed(4)}, ${installLng.toFixed(4)}` : null },
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
