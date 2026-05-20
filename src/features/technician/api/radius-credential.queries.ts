import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { MutationConfig } from "@/lib/react-query";

import type { GenerateRadiusCredentialRequest, GenerateRadiusCredentialResponse } from "../types/radius-credential-api";
import { generateWorkOrderRadiusCredential, getWorkOrderRadiusCredential } from "./radius-credential.api";

type UseRevealWorkOrderRadiusCredentialOptions = {
  mutationConfig?: MutationConfig<typeof getWorkOrderRadiusCredential>;
};

export const useRevealWorkOrderRadiusCredential = ({
  mutationConfig,
}: UseRevealWorkOrderRadiusCredentialOptions = {}) => {
  const { onError, onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: getWorkOrderRadiusCredential,
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    onError: (err, variables, context) => {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ??
        (err as Error)?.message ??
        "Failed to reveal RADIUS credentials";
      toast.error(message);
      onError?.(err, variables, context);
    },
    ...restConfig,
  });
};

type GenerateCredentialVariables = {
  workOrderId: string;
  data: GenerateRadiusCredentialRequest;
};

export const useGenerateWorkOrderRadiusCredential = () => {
  return useMutation<GenerateRadiusCredentialResponse, Error, GenerateCredentialVariables>({
    mutationFn: ({ workOrderId, data }) => generateWorkOrderRadiusCredential(workOrderId, data),
    onSuccess: (data) => {
      toast.success("RADIUS credentials generated successfully");
    },
    onError: (err) => {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ??
        (err as Error)?.message ??
        "Failed to generate RADIUS credentials";
      toast.error(message);
    },
  });
};
