import { z } from "zod";

export const oltSchema = z
  .object({
    name: z.string().min(1, "OLT name is required"),
    model: z.string().min(1, "Model is required"),
    ipAddress: z
      .string()
      .min(1, "IP address is required")
      .regex(
        /^(\d{1,3}\.){3}\d{1,3}$/,
        "Invalid IP address format"
      ),
    totalPorts: z.number().min(1, "Minimum 1 port"),
    status: z.enum(["active", "warning", "down"]),
    expansion: z.enum(["yes", "no"]),
    expansionPorts: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.expansion === "yes") {
      if (!data.expansionPorts || data.expansionPorts < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expansion ports is required when expansion is enabled",
          path: ["expansionPorts"],
        });
      }
    }
  });

export type OltFormValues = z.infer<typeof oltSchema>;

export const DEFAULT_OLT_VALUES: Partial<OltFormValues> = {
  name: "",
  model: "",
  ipAddress: "",
  totalPorts: 0,
  status: "active",
  expansion: "no",
  expansionPorts: undefined,
};
