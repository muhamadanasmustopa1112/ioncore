"use client";

import { Suspense } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Check, LoaderCircleIcon } from "lucide-react";
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
import { toAbsoluteUrl } from "@/lib/helpers";
import { useForgotPassword } from "@/features/user-service/api/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

function ResetPasswordFormInner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const { mutate: forgotPassword, isPending, isSuccess, error } = useForgotPassword();
  const apiError =
    (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ||
    (error ? "Something went wrong. Please try again." : null);

  const handleSubmit = form.handleSubmit((values) => {
    forgotPassword({ email: values.email });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="block w-full space-y-5">
        <img
          src={toAbsoluteUrl("/media/app/logo-wit-dark.png")}
          className="h-10 mx-auto mt-4"
          alt="WIT. Logo"
        />

        <div className="space-y-1 pb-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive a password reset link.
          </p>
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
            <AlertTitle>
              Reset link sent! Check your email inbox.
            </AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  disabled={isSuccess || isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSuccess || isPending} className="w-full">
          {isPending && <LoaderCircleIcon className="animate-spin" />}
          {isSuccess ? "Email Sent" : "Send Reset Link"}
        </Button>

        <Button type="button" variant="outline" className="w-full" asChild>
          <Link href="/signin">
            <ArrowLeft className="size-3.5" /> Back to Sign In
          </Link>
        </Button>
      </form>
    </Form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
