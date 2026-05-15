"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleLine, RiUser3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { paths } from "@/config/paths";
import { useCreateCustomer, useCreateCustomerDocument } from "@/features/customers/api/customers-queries";
import { useCreateOrder } from "@/features/operations/orders/api/orders-queries";
import { useUpdateLeadStatus } from "../api/leads-queries";
import type { LeadDetail } from "../types/leads-api";
import type { BroadbandPlan, Addon } from "@/features/products/types/products";

interface Props {
  lead: LeadDetail;
  selectedPlan: BroadbandPlan | null;
  selectedAddons: Addon[];
  open: boolean;
  onClose: () => void;
}

export function ConvertLeadSheet({ lead, selectedPlan, selectedAddons, open, onClose }: Props) {
  const router = useRouter();

  const [fullName, setFullName] = useState(lead.lead_name);
  const [companyName, setCompanyName] = useState("");
  const [totalRunCableMeters, setTotalRunCableMeters] = useState<number>(lead.cable_distance_meters ?? 0);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "converting" | "done">("form");
  const [error, setError] = useState<string | null>(null);

  const createCustomer = useCreateCustomer();
  const createOrder = useCreateOrder();
  const updateLeadStatus = useUpdateLeadStatus(lead.id);

  // createCustomerDocument requires customerId, initialized after customer creation
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(null);
  const uploadDocument = useCreateCustomerDocument(createdCustomerId ?? "");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setKtpFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setKtpPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setKtpPreview(null);
    }
  }

  async function handleConvert() {
    setStep("converting");
    setError(null);

    try {
      // Step 1: Create customer
      const customerRes = await createCustomer.mutateAsync({
        customer_type: lead.customer_sub_type === "residential" ? "residential" : "business",
        full_name: fullName.trim(),
        company_name: companyName.trim() || undefined,
        branch_id: lead.branch_id,
      });

      const customerId = customerRes.data.id;
      setCreatedCustomerId(customerId);

      // Step 2: Upload KTP if provided (best-effort — don't block conversion)
      if (ktpFile && ktpPreview) {
        try {
          // Use base64 data URL as file_url placeholder until S3 upload is wired
          await uploadDocument.mutateAsync({
            document_type: "ktp",
            file_url: ktpPreview,
          });
        } catch {
          // Non-blocking — conversion succeeds even if KTP upload fails
        }
      }

      // Step 3: Create order if plan selected
      if (selectedPlan) {
        await createOrder.mutateAsync({
          customer_id: customerId,
          order_type: "NEW_CONNECTION",
          plan_id: selectedPlan.id,
          latitude: lead.installation_point_lat ?? 0,
          longitude: lead.installation_point_lng ?? 0,
          channel: "DIRECT",
          lead_id: lead.id,
          ...(totalRunCableMeters > 0 && { total_run_cable_meters: totalRunCableMeters }),
          ...(selectedAddons.length > 0 && {
            addon_orders: selectedAddons.map((a) => ({ addon_id: a.id, addon_attribute: {} })),
          }),
        });
      }

      // Step 4: Mark lead as converted
      await updateLeadStatus.mutateAsync({ status: "converted", notes: "Converted to customer" });

      setStep("done");
      setTimeout(() => {
        onClose();
        router.push(paths.dashboard.crmAndSales.customer.detail.getHref(customerId));
      }, 1200);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Conversion failed. Check that all required fields are correct."
      );
      setStep("form");
    }
  }

  const isBusy = step === "converting";
  const customerType = lead.customer_sub_type === "residential" ? "Residential" : "Business";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && !isBusy && onClose()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:rounded-xl w-full sm:w-[480px]">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiUser3Line className="size-5 text-primary" />
            Convert Lead to Customer
          </SheetTitle>
        </SheetHeader>

        {step === "done" ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-6">
            <RiCheckboxCircleLine className="size-12 text-success" />
            <p className="font-semibold text-lg">Conversion complete</p>
            <p className="text-sm text-muted-foreground">Redirecting to customer profile…</p>
          </div>
        ) : (
          <>
            <SheetBody className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-5 py-4">
                <div className="flex flex-col gap-5">
                  {/* Lead context */}
                  <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lead type</span>
                      <Badge variant="secondary" size="sm">{customerType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Branch ID</span>
                      <span className="font-mono text-xs">{lead.branch_id}</span>
                    </div>
                    {lead.cable_distance_meters > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cable distance</span>
                        <span>{lead.cable_distance_meters} m {lead.is_excess_cable_accepted && <span className="text-warning text-xs">(excess accepted)</span>}</span>
                      </div>
                    )}
                  </div>

                  {/* Selected plan */}
                  {selectedPlan ? (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-semibold">{selectedPlan.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly</span>
                        <span>
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(selectedPlan.price)}
                        </span>
                      </div>
                      {selectedAddons.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Add-ons</span>
                          <span>{selectedAddons.length} selected</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription className="text-sm">
                        No plan selected. Customer will be created without an order.
                        You can create an order later from the customer profile.
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedPlan && !lead.installation_point_lat && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        No installation coordinates on this lead. Order will use (0, 0) — set the pin on the lead before converting.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Cable run */}
                  {selectedPlan && (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="conv-cable">Total run cable (meters)</Label>
                      <Input
                        id="conv-cable"
                        type="number"
                        min={0}
                        value={totalRunCableMeters}
                        onChange={(e) => setTotalRunCableMeters(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        disabled={isBusy}
                      />
                    </div>
                  )}

                  {/* Customer fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="conv-fullname">Full name <span className="text-destructive">*</span></Label>
                      <Input
                        id="conv-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name as on KTP"
                        disabled={isBusy}
                      />
                    </div>

                    {lead.customer_sub_type === "business" && (
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="conv-company">Company name</Label>
                        <Input
                          id="conv-company"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="PT / CV / UD"
                          disabled={isBusy}
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="conv-ktp">
                        KTP photo
                        <span className="text-muted-foreground text-xs ml-1">(optional — required for full validation)</span>
                      </Label>
                      <Input
                        id="conv-ktp"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={isBusy}
                        className="cursor-pointer"
                      />
                      {ktpPreview && (
                        <img
                          src={ktpPreview}
                          alt="KTP preview"
                          className="mt-1 rounded border max-h-32 object-contain w-full"
                        />
                      )}
                      {ktpFile && (
                        <p className="text-xs text-muted-foreground">
                          {ktpFile.name} · {(ktpFile.size / 1024).toFixed(0)} KB
                          {ktpFile.size > 5 * 1024 * 1024 && (
                            <span className="text-warning ml-1">⚠ File exceeds 5 MB — may be rejected by server</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
            </SheetBody>

            <SheetFooter className="border-t border-border px-5 py-4 gap-2">
              <Button variant="outline" onClick={onClose} disabled={isBusy}>
                Cancel
              </Button>
              <Button
                onClick={handleConvert}
                disabled={isBusy || !fullName.trim()}
                className="flex-1"
              >
                {isBusy ? "Converting…" : "Convert to Customer"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
