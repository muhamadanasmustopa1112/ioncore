import Axios, { InternalAxiosRequestConfig } from "axios";
import { auth, services } from "@/config/constants";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { clearAllCookies, getCookie, setCookie } from "@/lib/cookies";
import type { AuthPayload, UserServiceEnvelope } from "../types";

const isProxyMode =
  env.APP_URL === "/api-proxy" || env.APP_URL?.startsWith("/api-proxy/");

const BASE = isProxyMode ? "/api-proxy" : env.API_URL;

// Maps full backend service paths to short proxy aliases.
// Must match ionServices in next.config.mjs.
const PROXY_PATH_ALIASES: Array<[string, string]> = [
  ["/ion-user-service/api/v1", "/user"],
  ["/ion-branch-service/api/v1", "/branch"],
  ["/ion-networking-service/api/v1", "/networking"],
  ["/ion-order-service", "/order"],
  ["/ion-rule-scheme-service", "/rule-scheme"],
  ["/ion-product-service", "/product"],
  ["/ion-sales-service", "/sales"],
  ["/ion-customer-service", "/customer"],
];

function toProxyAlias(url: string): string {
  for (const [full, alias] of PROXY_PATH_ALIASES) {
    if (url.startsWith(full)) return alias + url.slice(full.length);
  }
  return url;
}

export const userServiceApi = Axios.create({ baseURL: BASE });

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }
  const token = getCookie(auth.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const activeBranch = getCookie(auth.active_branch_id);
  if (activeBranch) config.headers["X-Branch-ID"] = activeBranch;

  // In proxy mode, rewrite /ion-*-service/api/v1/... → /user/... etc.
  // so Next.js rewrites can forward to the correct backend path.
  if (isProxyMode && config.url) {
    config.url = toProxyAlias(config.url);
  }

  return config;
}

userServiceApi.interceptors.request.use(requestInterceptor);

let refreshPromise: Promise<string> | null = null;
let isRedirectingToSignin = false;

async function doRefresh(): Promise<string> {
  const refreshToken = getCookie(auth.refresh_token);
  if (!refreshToken) throw new Error("no refresh token");

  // Use plain Axios (not userServiceApi) to avoid the response interceptor
  // transforming the response, and to avoid triggering another 401 retry loop.
  const servicePath = isProxyMode
    ? toProxyAlias(services.user)
    : services.user;
  const resp = await Axios.post(
    `${BASE}${servicePath}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { Accept: "application/json" } },
  );

  // resp.data = UserServiceEnvelope<AuthPayload> = { status, message, data: AuthPayload }
  const envelope = resp.data as UserServiceEnvelope<AuthPayload>;
  const tokens = envelope?.data?.tokens;

  if (!tokens?.access_token) throw new Error("refresh response missing access_token");

  const DAY = 1000 * 60 * 60 * 24;
  setCookie(auth.token, tokens.access_token, new Date(Date.now() + DAY));
  if (tokens.refresh_token) {
    setCookie(auth.refresh_token, tokens.refresh_token, new Date(Date.now() + 30 * DAY));
  }
  // Keep logged_in alive so the auth guard doesn't redirect on next load
  setCookie(auth.logged_in, "1", new Date(Date.now() + 30 * DAY));

  return tokens.access_token;
}

function redirectToSignin() {
  if (isRedirectingToSignin) return;
  isRedirectingToSignin = true;

  clearAllCookies();
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/signin")
  ) {
    window.location.replace(paths.auth.signin.getHref(window.location.pathname));
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
