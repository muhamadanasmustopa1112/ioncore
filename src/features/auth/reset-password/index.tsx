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
    <>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute w-80 h-80 border-2 border-black/25 rounded-3xl backdrop-blur-sm"
          style={{
            top: "10%",
            left: "-120px",
            animation: "rotateShape 22s linear infinite",
          }}
        />
        <div
          className="absolute w-80 h-80 border-2 border-black/25 rounded-3xl backdrop-blur-sm"
          style={{
            bottom: "5%",
            right: "-140px",
            animation: "rotateShape 16s linear infinite",
          }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="block w-full space-y-4 px-[20px]">
          <img
            src={toAbsoluteUrl("/media/app/logo-wit-dark.png")}
            className="h-10 mx-auto mt-4"
            alt="WIT. Logo"
          />

          <div className="space-y-1 pb-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and we&apos;ll send you a reset link.
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
              <AlertTitle>Reset link sent! Check your email inbox.</AlertTitle>
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
                    placeholder="Your email address"
                    disabled={isSuccess || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2.5">
            <Button type="submit" disabled={isSuccess || isPending} className="w-full">
              {isPending && <LoaderCircleIcon className="size-4 animate-spin" />}
              {isSuccess ? "Email Sent" : "Send Reset Link"}
            </Button>
          </div>

          <div className="flex justify-center">
            <Link
              href="/signin"
              className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </Form>

      <style jsx>{`
        @keyframes rotateShape {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
      `}</style>
    </>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
