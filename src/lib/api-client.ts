/*
  Installed from github/Few-IT/few-it-registries/tree/master
*/

import Axios, { InternalAxiosRequestConfig } from "axios";
import { auth, responses } from "@/config/constants";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { clearAllCookies, getCookie } from "./cookies";
import { generateToken } from "./token";

// let tokenRequestCache: Promise<Response> | null = null;
// let lastTokenRequest = 0;
// const TOKEN_REQUEST_COOLDOWN = 5000;
let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const isProxyMode =
  env.APP_URL === "/api-proxy" || env.APP_URL?.startsWith("/api-proxy/");

export const api = Axios.create({
  baseURL: isProxyMode ? "/api-proxy" : env.API_URL,
  // withCredentials: true,
});

async function authRequestInterceptorLocal(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  const token = getCookie(auth.token);
  if (token) {
    config.headers.token = token;
  }

  return config;
}

api.interceptors.request.use(authRequestInterceptorLocal);

api.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.response?.message_en ||
      error?.response?.data?.error ||
      error.message;

    if (message === responses.headerTokenNotFound && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(api.request(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const response = await generateToken();

      processQueue(null);

      // retry the request
      return api.request({
        ...error.config,
        headers: {
          ...error.config.headers,
          token: response?.token,
        },
      });
    }

    if (message === responses.pleaseLoginFirst && !originalRequest._retry) {
      originalRequest._retry = true;
      clearAllCookies();
      setTimeout(() => {
        const pathname = window.location.pathname;
        window.location.href = paths.auth.signin.getHref(pathname);
      }, 100); // Minimal delay untuk prevent race condition
      return Promise.reject(error);
    }

    if (
      (message === responses.unauthorizedRefreshToken ||
        message === responses.unauthorizedToken ||
        error.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      // await fetch(`/api/auth/logout`, {
      //   method: "POST",
      //   credentials: "include",
      // });
      clearAllCookies();

      // Single redirect dengan check
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/?redirectTo=")
      ) {
        setTimeout(() => {
          originalRequest._retry = false;
          window.location.href = paths.home.getHref();
        }, 100); // Minimal delay untuk prevent race condition
      }
    }

    return Promise.reject(error);
  },
);

// apiLocal used when we're using next.js api, to make proxy of backend API
// export const apiLocal = Axios.create({
//   withCredentials: true,
// });

// async function authRequestInterceptorLocal(config: InternalAxiosRequestConfig) {
//   if (config.headers) {
//     config.headers.Accept = "application/json";
//   }

//   return config;
// }

// apiLocal.interceptors.request.use(authRequestInterceptorLocal);

// apiLocal.interceptors.response.use(
//   async (response) => {
//     return response.data;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const message =
//       error.response?.data?.response?.message_en ||
//       error?.response?.data?.error ||
//       error.message;

//     if (message === responses.headerTokenNotFound && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: () => {
//               resolve(apiLocal.request(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;
//       await fetch(`/api/auth/token`, {
//         credentials: "include",
//         headers: {
//           "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
//         },
//       })
//         .catch((error) => {
//           return Promise.reject(error);
//         })
//         .finally(() => {
//           isRefreshing = false;
//         });

//       processQueue(null);

//       // retry the request
//       return apiLocal.request(error.config);
//     }

//     if (message === responses.pleaseLoginFirst && !originalRequest._retry) {
//       originalRequest._retry = true;
//       clearAllCookies();
//       setTimeout(() => {
//         window.location.href = paths.home.getHref();
//       }, 100); // Minimal delay untuk prevent race condition
//       return Promise.reject(error);
//     }

//     if (
//       (message === responses.unauthorizedRefreshToken ||
//         message === responses.unauthorizedToken ||
//         error.status === 401) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       await fetch(`/api/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });

//       // Single redirect dengan check
//       if (
//         typeof window !== "undefined" &&
//         !window.location.pathname.includes("/?redirectTo=")
//       ) {
//         setTimeout(() => {
//           window.location.href = paths.home.getHref();
//         }, 100); // Minimal delay untuk prevent race condition
//       }
//     }

//     return Promise.reject(error);
//   },
// );
