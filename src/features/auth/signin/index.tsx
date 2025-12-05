"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningFill } from "@remixicon/react";
import { isAxiosError } from "axios";
import { AlertCircle, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { auth, responses, state } from "@/config/constants";
import { paths } from "@/config/paths";
import { LoginInput, loginInputSchema, useLogin } from "@/lib/auth";
import { getCookie, setCookie } from "@/lib/cookies";
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
import { Icons } from "@/components/common/icons";

export function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || null;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending: isProcessing } = useLogin({
    onSuccess(data) {
      if (data?.response?.message_en === responses.success) {
        setError(null);
        setCookie(
          auth.logged_in,
          state.loggedIn,
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        );
        router.push(paths.home.getHref());
        return;
      }

      setError(
        data?.response?.message_en ||
          "An unexpected error occurred. Please try again.",
      );
    },
    onError(error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.message_en;
        if (errorMessage) {
          return {
            success: false,
            message: errorMessage,
          };
        }
      }
    },
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: "demo.account@gmail.com",
      password: "01012000",
    },
  });

  async function onSubmit(values: any) {
    setError(null);

    login(values);
  }

  useLayoutEffect(() => {
    const isLoggedIn = getCookie(auth.logged_in);
    if (isLoggedIn === state.loggedIn) {
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
      router.push(paths.dashboard.employee.list.getHref());
    }
  }, [redirectTo]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5 px-[20px]"
      >
        <div className="space-y-1.5 pb-3">
          <h1 className="text-left text-2xl font-semibold tracking-tight">
            Sign in to App Name
          </h1>
        </div>

        {/* <Alert size="sm" close={false}>
          <AlertIcon>
            <RiErrorWarningFill className="text-primary" />
          </AlertIcon>
          <AlertTitle className="text-accent-foreground">
            Use <span className="text-mono font-semibold">demo@kt.com</span>{" "}
            username and{" "}
            <span className="text-mono font-semibold">demo123</span> for demo
            access.
          </AlertTitle>
        </Alert> */}

        {error && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2.5">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/reset-password"
                  className="text-foreground hover:text-primary text-sm font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="Your password"
                  type={passwordVisible ? "text" : "password"} // Toggle input type
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                  className="absolute end-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 bg-transparent!"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Remember me
                </label>
              </>
            )}
          />
        </div> */}

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-foreground hover:text-primary text-sm font-semibold"
          >
            Sign Up
          </Link>
        </p>
        
        <div className="relative py-1.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">or</span>
          </div>
        </div>

        <div className="flex gap-3.5">

          <Button variant="outline" type="button" className="w-full" onClick={() => {}}>
            <Icons.googleColorful className="size-5! opacity-100!" /> Google
          </Button>

          <Button variant="outline" type="button" className="w-full" onClick={() => {}}>
            <Icons.apple className="size-5! opacity-100!" /> Apple
          </Button>
        </div>
      </form>
    </Form>
  );
}
