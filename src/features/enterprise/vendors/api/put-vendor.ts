import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_VENDORS } from "../data/dummy-vendors";
import type { UpdateVendorPayload, Vendor } from "../types/vendor";
import { VENDOR_KEYS } from "./keys";

export function useUpdateVendor() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVendorPayload }): Promise<{ data: Vendor }> => {
      const index = DUMMY_VENDORS.findIndex((v) => v.id === id);
      if (index === -1) throw new Error("Vendor not found");
      const updated: Vendor = {
        ...DUMMY_VENDORS[index],
        ...payload,
        status: payload.is_active ? "active" : "inactive",
        updated_at: new Date().toISOString(),
      };
      DUMMY_VENDORS[index] = updated;
      return Promise.resolve({ data: updated });
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.detail(id), exact: false, refetchType: "active" });
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Vendor updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update vendor.");
    },
  });
}
