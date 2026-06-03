import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_IC_POS } from "../data/dummy-ic-po";
import type { UpdateIcPoPayload, IntercompanyPo } from "../types/ic-po";
import { IC_PO_KEYS } from "./keys";

export function useUpdateIcPo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateIcPoPayload }): Promise<{ data: IntercompanyPo }> => {
      const index = DUMMY_IC_POS.findIndex((po) => po.id === id);
      if (index === -1) throw new Error("IC-PO not found");
      const linesWithId = payload.lines.map((line, i) => ({
        ...line,
        id: `icl-${String(index * 10 + i + 1).padStart(3, "0")}`,
      }));
      const total_amount = linesWithId.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
      const updated: IntercompanyPo = {
        ...DUMMY_IC_POS[index],
        issuer_company_id: payload.issuer_company_id,
        issuer_company_name: payload.issuer_company_name,
        receiver_company_id: payload.receiver_company_id,
        receiver_company_name: payload.receiver_company_name,
        project_id: payload.project_id,
        boq_version_id: payload.boq_version_id,
        lines: linesWithId,
        total_amount,
      };
      DUMMY_IC_POS[index] = updated;
      return Promise.resolve({ data: updated });
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: IC_PO_KEYS.detail(id), exact: false, refetchType: "active" });
      qc.invalidateQueries({ queryKey: IC_PO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Intercompany PO updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update intercompany PO.");
    },
  });
}
