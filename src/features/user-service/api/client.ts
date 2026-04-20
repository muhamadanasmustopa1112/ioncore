import Axios, { InternalAxiosRequestConfig } from "axios";
import { auth } from "@/config/constants";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { clearAllCookies, getCookie } from "@/lib/cookies";
import type { UserServiceEnvelope } from "../types";

const isProxyMode =
  env.APP_URL === "/api-proxy" || env.APP_URL?.startsWith("/api-proxy/");

export const userServiceApi = Axios.create({
  baseURL: isProxyMode ? "/api-proxy" : env.API_URL,
});

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  const token = getCookie(auth.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeBranch = getCookie(auth.active_branch_id);
  if (activeBranch) {
    config.headers["X-Branch-ID"] = activeBranch;
  }

  return config;
}

userServiceApi.interceptors.request.use(requestInterceptor);

userServiceApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      clearAllCookies();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/signin")
      ) {
        setTimeout(() => {
          window.location.href = paths.auth.signin.getHref(
            window.location.pathname,
          );
        }, 100);
      }
    }

    return Promise.reject(error);
  },
);

export type { UserServiceEnvelope };
