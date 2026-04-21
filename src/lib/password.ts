import { z } from "zod";

const SPECIAL = /[!@#$%^&*()\-_=+\[\]{};:,.?]/;

export interface PasswordRules {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  special: boolean;
  noSpace: boolean;
}

export function getPasswordRules(password: string): PasswordRules {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: SPECIAL.test(password),
    noSpace: !/\s/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const r = getPasswordRules(password);
  return r.length && r.uppercase && r.lowercase && r.special && r.noSpace;
}

export const passwordZodSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(SPECIAL, "At least one special character (!@#$%^&*-_=+etc.)")
  .regex(/^\S*$/, "No spaces allowed");
