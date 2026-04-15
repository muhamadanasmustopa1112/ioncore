import { z } from "zod";

export const popSchema = z.object({
  name: z.string().min(1, "POP Name is required"),
  area: z.string().min(1, "Area is required"),
  latitude: z.string(),
  longitude: z.string(),
  status: z.enum(["active", "warning", "down"]),
});

export type PopFormValues = z.infer<typeof popSchema>;

export const DEFAULT_POP_VALUES: Partial<PopFormValues> = {
  name: "",
  area: "",
  latitude: "",
  longitude: "",
  status: "active",
};

export interface PopData {
  id: string;
  name: string;
  address: string;
  oltCount: number;
  odpCount: number;
  area: string;
  latitude: number;
  longitude: number;
  status: "active" | "warning" | "down";
  isValidated: boolean;
}