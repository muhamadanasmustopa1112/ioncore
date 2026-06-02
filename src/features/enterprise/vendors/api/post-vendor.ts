import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_VENDORS } from "../data/dummy-vendors";
import type { CreateVendorPayload, Vendor } from "../types/vendor";
import { VENDOR_KEYS } from "./keys";

export function useCreateVendor() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVendorPayload): Promise<{ data: Vendor }> => {
      const newVendor: Vendor = {
        id: `v-${String(DUMMY_VENDORS.length + 1).padStart(3, "0")}`,
        ...payload,
        status: payload.is_active ? "active" : "inactive",
        onboarding_date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DUMMY_VENDORS.push(newVendor);
      return Promise.resolve({ data: newVendor });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Vendor created successfully.");
    },
    onError: () => {
      toast.error("Failed to create vendor.");
    },
  });
}
