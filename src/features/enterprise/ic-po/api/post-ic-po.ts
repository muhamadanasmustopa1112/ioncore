import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_IC_POS } from "../data/dummy-ic-po";
import type { CreateIcPoPayload, IntercompanyPo } from "../types/ic-po";
import { IC_PO_KEYS } from "./keys";

export function useCreateIcPo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIcPoPayload): Promise<{ data: IntercompanyPo }> => {
      const linesWithId = payload.lines.map((line, i) => ({
        ...line,
        id: `icl-${String(DUMMY_IC_POS.length * 10 + i + 1).padStart(3, "0")}`,
      }));
      const total_amount = linesWithId.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
      const newPo: IntercompanyPo = {
        id: `icpo-${String(DUMMY_IC_POS.length + 1).padStart(3, "0")}`,
        issuer_company_id: payload.issuer_company_id,
        issuer_company_name: payload.issuer_company_name,
        receiver_company_id: payload.receiver_company_id,
        receiver_company_name: payload.receiver_company_name,
        project_id: payload.project_id,
        boq_version_id: payload.boq_version_id,
        status: "draft",
        lines: linesWithId,
        total_amount,
        created_at: new Date().toISOString(),
      };
      DUMMY_IC_POS.push(newPo);
      return Promise.resolve({ data: newPo });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: IC_PO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Intercompany PO created successfully.");
    },
    onError: () => {
      toast.error("Failed to create intercompany PO.");
    },
  });
}
