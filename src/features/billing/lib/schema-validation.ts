import { useMutation } from "@tanstack/react-query";
import type { AppliedBillingSchemaRules } from "../invoice/types";
import type { AppliedSuspensionRules } from "../suspension/types";

export interface SchemaValidationResult {
  valid: boolean;
  appliedRules: Record<string, unknown> | null;
  warnings: string[];
  errors: string[];
}

export function useValidateBillingSchema(
  schemaVersionId: string,
  invoiceData?: Record<string, unknown>
) {
  return useMutation<SchemaValidationResult, Error, void>({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const warnings: string[] = [];
      const errors: string[] = [];

      if (invoiceData) {
        const schemaRules = {} as AppliedBillingSchemaRules;

        if (
          schemaRules.otcType === "prepaid" &&
          invoiceData.type === "otc" &&
          !invoiceData.paidDate
        ) {
          warnings.push(
            "Prepaid OTC requires payment confirmation before WO dispatch"
          );
        }
      }

      return {
        valid: errors.length === 0,
        appliedRules: null,
        warnings,
        errors,
      };
    },
  });
}

export function useValidateSuspensionSchema(
  schemaVersionId: string,
  suspensionData?: Record<string, unknown>
) {
  return useMutation<SchemaValidationResult, Error, void>({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const warnings: string[] = [];
      const errors: string[] = [];

      if (suspensionData) {
        const schemaRules = {} as AppliedSuspensionRules;

        if (
          schemaRules.requiresExecutiveApproval &&
          !schemaRules.requiresApproval
        ) {
          errors.push(
            "Executive approval requires Finance Manager approval first"
          );
        }
      }

      return {
        valid: errors.length === 0,
        appliedRules: null,
        warnings,
        errors,
      };
    },
  });
}
