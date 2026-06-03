import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_RESELLERS } from "../data/dummy-resellers";
import type { CreateResellerPayload, Reseller } from "../types/reseller";
import { RESELLER_KEYS } from "./keys";

export function useCreateReseller() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (payload: CreateResellerPayload): Promise<{ data: Reseller }> => {
      const now = new Date().toISOString();
      const newReseller: Reseller = {
        id: `rs-${String(DUMMY_RESELLERS.length + 1).padStart(3, "0")}`,
        legal_name: payload.legal_name,
        contact_person: payload.contact_person,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        tax_id: payload.tax_id,
        parent_sister_company_id: payload.parent_sister_company_id,
        parent_sister_company_name: payload.parent_sister_company_id === "comp-001" ? "PT Aman Sentosa" : payload.parent_sister_company_id === "comp-002" ? "PT Visi Teknologi" : "PT Cahaya Fiber",
        status: payload.status,
        platform_tenant_id: payload.platform_tenant_id ?? `t-${String(DUMMY_RESELLERS.length + 1).padStart(3, "0")}`,
        onboarding_date: now.split("T")[0],
        created_at: now,
      };
      DUMMY_RESELLERS.push(newReseller);
      return Promise.resolve({ data: newReseller });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESELLER_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Reseller created successfully.");
    },
    onError: () => {
      toast.error("Failed to create reseller.");
    },
  });
}
