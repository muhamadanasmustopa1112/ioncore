import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_VENDORS } from "../data/dummy-vendors";
import { VENDOR_KEYS } from "./keys";

export function useDeleteVendor() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const index = DUMMY_VENDORS.findIndex((v) => v.id === id);
      if (index !== -1) DUMMY_VENDORS.splice(index, 1);
      return Promise.resolve({ data: null });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Vendor deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete vendor.");
    },
  });
}
