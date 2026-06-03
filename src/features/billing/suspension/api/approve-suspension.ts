import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SUSPENSION_KEYS } from "./keys";
import { toast } from "sonner";

export function useApproveSuspension({
  mutationConfig,
}: {
  mutationConfig?: {
    onSuccess?: () => void;
  };
} = {}) {
  const queryClient = getQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: { id, status: "suspended" } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SUSPENSION_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      toast.success("Suspension approved. Service suspended via ION Radius.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to approve suspension.");
    },
    ...restConfig,
  });
}
