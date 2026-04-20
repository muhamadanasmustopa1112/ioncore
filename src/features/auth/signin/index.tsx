"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningFill } from "@remixicon/react";
import { isAxiosError } from "axios";
import { AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff, LoaderCircleIcon, Zap } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { QUICK_LOGIN_USERS, QuickLoginAccount } from "@/data/dummy-quick-login";
import { useForm } from "react-hook-form";
import { auth, state } from "@/config/constants";
import { paths } from "@/config/paths";
import { LoginInput, loginInputSchema } from "@/lib/auth";
import { useLogin } from "@/features/user-service/api/auth";
import { persistAuthPayload } from "@/features/user-service/utils";
import { getCookie } from "@/lib/cookies";
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
import { toAbsoluteUrl } from "@/lib/helpers";
import { Checkbox } from "@/components/ui/checkbox";

export function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || null;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const { loginFromPayload } = useAuthStore();

  const { mutateAsync: login, isPending: isProcessing } = useLogin();

  const handleLoginResult = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await login({ email, password });
      const payload = res?.data;
      if (!payload?.tokens?.access_token || !payload?.user) {
        setError(res?.message || "Invalid login response.");
        return false;
      }
      persistAuthPayload(payload);
      loginFromPayload(payload);
      return true;
    } catch (err) {
      if (isAxiosError(err)) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message;
        setError(msg || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
      return false;
    }
  };

  type ExtendedLoginInput = LoginInput & { rememberMe?: boolean };

  const rememberedUsername =
    typeof window !== "undefined"
      ? localStorage.getItem("rememberedUsername")
      : null;

  const form = useForm<ExtendedLoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: rememberedUsername || "demo.account@gmail.com",
      password: "01012000",
      rememberMe: !!rememberedUsername,
    },
  });

  const handleQuickLogin = async (account: QuickLoginAccount) => {
    const ok = await handleLoginResult(account.email, account.password);
    if (ok) router.push(paths.dashboard.root.getHref());
  };

  async function onSubmit(values: ExtendedLoginInput) {
    try {
      if (values.rememberMe) {
        localStorage.setItem("rememberedUsername", values.username || "");
      } else {
        localStorage.removeItem("rememberedUsername");
      }
    } catch (e) {
      // ignore storage errors
    }

    const ok = await handleLoginResult(values.username, values.password);
    if (ok) router.push(paths.dashboard.root.getHref());
  }

  useLayoutEffect(() => {
    const isLoggedIn = getCookie(auth.logged_in);
    if (isLoggedIn === state.loggedIn) {
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
      router.push(paths.dashboard.root.getHref());
    }
  }, [redirectTo]);

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-4 px-[20px]"
        >
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

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <>
                  <Checkbox
                    id="remember-me"
                    checked={!!field.value}
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
          </div>

          <div className="flex flex-col gap-2.5">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : null}
              Login
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
            <Button variant="outline" type="button" className="w-full" onClick={() => { }}>
              <Icons.googleColorful className="size-5! opacity-100!" /> Google
            </Button>
          </div>

          {/* Quick Access — Dev Only */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Zap className="size-3.5 text-yellow-500" />
                Quick Access (Dev Only)
              </span>
              {showQuickAccess ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {showQuickAccess && (
              <div className="border-t border-border p-3">
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_LOGIN_USERS.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleQuickLogin(account)}
                      className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-left hover:bg-muted/60 hover:border-primary/30 transition-all group disabled:opacity-60"
                    >
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 group-hover:bg-primary/20">
                        {account.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{account.role}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{account.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* <div className="pt-4 md:pt-6 mb-2">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} WIT. All rights reserved.
            </p>
          </div> */}
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
