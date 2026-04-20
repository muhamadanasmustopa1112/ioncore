import Axios, { InternalAxiosRequestConfig } from "axios";
import { auth, services } from "@/config/constants";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { clearAllCookies, getCookie, setCookie } from "@/lib/cookies";
import type { AuthPayload, UserServiceEnvelope } from "../types";

const isProxyMode =
  env.APP_URL === "/api-proxy" || env.APP_URL?.startsWith("/api-proxy/");

const BASE = isProxyMode ? "/api-proxy" : env.API_URL;

export const userServiceApi = Axios.create({ baseURL: BASE });

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }
  const token = getCookie(auth.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const activeBranch = getCookie(auth.active_branch_id);
  if (activeBranch) config.headers["X-Branch-ID"] = activeBranch;

  return config;
}

userServiceApi.interceptors.request.use(requestInterceptor);

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const refreshToken = getCookie(auth.refresh_token);
  if (!refreshToken) throw new Error("no refresh token");

  const resp = await Axios.post<unknown, { data: AuthPayload }>(
    `${BASE}${services.user}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { Accept: "application/json" } },
  );

  const payload = (resp as unknown as UserServiceEnvelope<AuthPayload>).data;
  const tokens = payload?.tokens ?? (payload as unknown as AuthPayload["tokens"]);

  const accessToken =
    (payload as AuthPayload)?.tokens?.access_token ??
    (tokens as unknown as { access_token: string })?.access_token;

  const newRefresh =
    (payload as AuthPayload)?.tokens?.refresh_token ??
    (tokens as unknown as { refresh_token: string })?.refresh_token;

  if (!accessToken) throw new Error("refresh response missing access_token");

  const DAY = 1000 * 60 * 60 * 24;
  setCookie(auth.token, accessToken, new Date(Date.now() + DAY));
  if (newRefresh) {
    setCookie(auth.refresh_token, newRefresh, new Date(Date.now() + 30 * DAY));
  }

  return accessToken;
}

function redirectToSignin() {
  clearAllCookies();
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/signin")
  ) {
    window.location.href = paths.auth.signin.getHref(window.location.pathname);
  }
}

userServiceApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return userServiceApi(originalRequest);
      } catch {
        redirectToSignin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export type { UserServiceEnvelope };
