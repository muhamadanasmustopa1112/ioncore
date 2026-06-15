"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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
import { auth } from "@/config/constants";
import { paths } from "@/config/paths";
import { useChangeMyPassword, useResetPassword } from "@/features/user-service/api/auth";
import { getCookie } from "@/lib/cookies";
import { passwordZodSchema } from "@/lib/password";

const resetPasswordSchema = z
  .object({
    newPassword: passwordZodSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordZodSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

function PasswordField({
  label,
  visible,
  onToggle,
  ...field
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
  ref: React.Ref<HTMLInputElement>;
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            type={visible ? "text" : "password"}
            placeholder={label}
            {...field}
          />
        </FormControl>
        <Button
          type="button"
          variant="ghost"
          mode="icon"
          onClick={onToggle}
          className="absolute end-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 bg-transparent!"
        >
          {visible ? <EyeOff className="text-muted-foreground" /> : <Eye className="text-muted-foreground" />}
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}

function ResetPasswordWithTokenForm({ token }: { token: string }) {
  const router = useRouter();
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { mutate: resetPassword, isPending, isSuccess, error } = useResetPassword();
  const apiError =
    (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ||
    (error ? "Password reset failed. The link may have expired." : null);

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
                <PasswordField
                  label="New Password"
                  visible={pwVisible}
                  onToggle={() => setPwVisible((v) => !v)}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <PasswordField
                  label="Confirm New Password"
                  visible={confirmVisible}
                  onToggle={() => setConfirmVisible((v) => !v)}
                  {...field}
                />
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

function AuthenticatedChangePasswordForm() {
  const router = useRouter();
  const isLoggedIn = getCookie(auth.logged_in) === "1";

  const [oldVisible, setOldVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { mutate: changePassword, isPending, isSuccess, error } = useChangeMyPassword();
  const apiError =
    (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ||
    (error ? "Failed to change password." : null);

  if (!isLoggedIn) {
    return (
      <div className="space-y-4 text-center">
        <Alert variant="destructive">
          <AlertIcon><AlertCircle /></AlertIcon>
          <AlertTitle>Please sign in to change your password.</AlertTitle>
        </Alert>
        <Button asChild variant="outline" className="w-full">
          <Link href={paths.auth.signin.getHref("/change-password")}>
            <ArrowLeft className="size-3.5" /> Back to Sign In
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = form.handleSubmit((values) => {
    changePassword(
      {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          form.reset();
          setTimeout(() => router.push(paths.profile.getHref()), 1500);
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="block w-full space-y-4">
        <div className="space-y-1 pb-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Change Password</h1>
          <p className="text-muted-foreground text-sm">Enter your current and new password.</p>
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
            <AlertTitle>Password changed successfully! Redirecting to profile…</AlertTitle>
          </Alert>
        )}

        {!isSuccess && (
          <>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <PasswordField
                  label="Current Password"
                  visible={oldVisible}
                  onToggle={() => setOldVisible((v) => !v)}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <PasswordField
                  label="New Password"
                  visible={newVisible}
                  onToggle={() => setNewVisible((v) => !v)}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <PasswordField
                  label="Confirm New Password"
                  visible={confirmVisible}
                  onToggle={() => setConfirmVisible((v) => !v)}
                  {...field}
                />
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <LoaderCircleIcon className="size-4 animate-spin" />}
              Change Password
            </Button>

            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={paths.profile.getHref()}><ArrowLeft className="size-3.5" /> Back to Profile</Link>
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}

export function ChangePasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  if (token) {
    return <ResetPasswordWithTokenForm token={token} />;
  }

  return <AuthenticatedChangePasswordForm />;
}
