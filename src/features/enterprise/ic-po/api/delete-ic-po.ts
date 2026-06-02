import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_IC_POS } from "../data/dummy-ic-po";
import { IC_PO_KEYS } from "./keys";

export function useDeleteIcPo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const index = DUMMY_IC_POS.findIndex((po) => po.id === id);
      if (index !== -1) DUMMY_IC_POS.splice(index, 1);
      return Promise.resolve({ data: null });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: IC_PO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Intercompany PO deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete intercompany PO.");
    },
  });
}
