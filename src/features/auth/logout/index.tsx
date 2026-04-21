"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/config/constants";
import { clearAllCookies, getCookie } from "@/lib/cookies";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/features/user-service/api/auth";
import { ScreenLoader } from "@/components/screen-loader";

export function LogoutPage() {
  const { logout: clearAuth } = useAuthStore();
  const { mutate: logoutApi } = useLogout();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const refreshToken = getCookie(auth.refresh_token) || "";

    // Fire logout API in background — don't wait for callback
    // qc.clear() inside useLogout's onSuccess kills mutation observers before per-mutate callbacks run
    logoutApi({ refresh_token: refreshToken });

    clearAuth();
    clearAllCookies();
    window.location.replace("/signin");
  }, []);

  return <ScreenLoader />;
}
