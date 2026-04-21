"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/features/user-service/api/auth";
import { passwordZodSchema } from "@/lib/password";

const formSchema = z
  .object({
    newPassword: passwordZodSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { mutate: resetPassword, isPending, isSuccess, error } = useResetPassword();
  const apiError =
    (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ||
    (error ? "Password reset failed. The link may have expired." : null);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <Alert variant="destructive">
          <AlertIcon><AlertCircle /></AlertIcon>
          <AlertTitle>No reset token provided.</AlertTitle>
        </Alert>
        <Button asChild variant="outline" className="w-full">
          <Link href="/signin"><ArrowLeft className="size-3.5" /> Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = form.handleSubmit((values) => {
    resetPassword(
      { token, new_password: values.newPassword },
      { onSuccess: () => setTimeout(() => router.push("/signin"), 2500) },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="block w-full space-y-4">
        <div className="space-y-1 pb-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground text-sm">Enter your new password below.</p>
        </div>

        {apiError && (
          <Alert variant="destructive">
            <AlertIcon><AlertCircle /></AlertIcon>
            <AlertTitle>{apiError}</AlertTitle>
          </Alert>
        )}

        {isSuccess && (
          <Alert>
            <AlertIcon><Check /></AlertIcon>
            <AlertTitle>Password reset successful! Redirecting to sign in…</AlertTitle>
          </Alert>
        )}

        {!isSuccess && (
          <>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={pwVisible ? "text" : "password"} placeholder="Enter new password" {...field} />
                    </FormControl>
                    <Button type="button" variant="ghost" mode="icon" onClick={() => setPwVisible(!pwVisible)}
                      className="absolute end-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 bg-transparent!">
                      {pwVisible ? <EyeOff className="text-muted-foreground" /> : <Eye className="text-muted-foreground" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={confirmVisible ? "text" : "password"} placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <Button type="button" variant="ghost" mode="icon" onClick={() => setConfirmVisible(!confirmVisible)}
                      className="absolute end-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 bg-transparent!">
                      {confirmVisible ? <EyeOff className="text-muted-foreground" /> : <Eye className="text-muted-foreground" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <LoaderCircleIcon className="size-4 animate-spin" />}
              Reset Password
            </Button>

            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/signin"><ArrowLeft className="size-3.5" /> Back to Sign In</Link>
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
