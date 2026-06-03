import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_RESELLERS } from "../data/dummy-resellers";
import type { CreateResellerPayload, Reseller } from "../types/reseller";
import { RESELLER_KEYS } from "./keys";

export function useUpdateReseller() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateResellerPayload }): Promise<{ data: Reseller }> => {
      const index = DUMMY_RESELLERS.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Reseller not found");
      const updated: Reseller = {
        ...DUMMY_RESELLERS[index],
        legal_name: payload.legal_name,
        contact_person: payload.contact_person,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        tax_id: payload.tax_id,
        parent_sister_company_id: payload.parent_sister_company_id,
        parent_sister_company_name: payload.parent_sister_company_id === "comp-001" ? "PT Aman Sentosa" : payload.parent_sister_company_id === "comp-002" ? "PT Visi Teknologi" : "PT Cahaya Fiber",
        status: payload.status,
      };
      DUMMY_RESELLERS[index] = updated;
      return Promise.resolve({ data: updated });
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: RESELLER_KEYS.detail(id), exact: false, refetchType: "active" });
      qc.invalidateQueries({ queryKey: RESELLER_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Reseller updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update reseller.");
    },
  });
}
