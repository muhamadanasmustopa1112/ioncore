"use client";

import { ReactNode } from "react";
import { redirect, RedirectType } from "next/navigation";
import { useUsers } from "@/features/auth/api";
import { isAxiosError } from "axios";
import { Loader } from "lucide-react";
import { configureAuth } from "react-query-auth";
import { z } from "zod";
import { AuthUser } from "@/types/auth";
import { BaseResponse } from "@/types/base";
import { auth, services, state } from "@/config/constants";
import { paths } from "@/config/paths";
import { api } from "./api-client";
import { getCookie } from "./cookies";

export const loginInputSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

const login = (data: LoginInput): Promise<BaseResponse<AuthUser>> => {
  return api.post(`${services.auth}/authentication/login`, data);
};

const getUser = (): Promise<BaseResponse<AuthUser>> => {
  return api.get(`${services.auth}/authentication/profile`);
};

const logout = () => api.post(`${services.auth}/logout`);

const authConfig = {
  userFn: async () => {
    const response = await getUser();
    return response;
  },
  loginFn: async (data: LoginInput) => {
    return login(data);
  },
  // notes:
  // we aren't using this API for example.
  // if you need to set this function,
  // simply update this.
  registerFn: async (data: LoginInput) => {
    const response = await login(data);
    return response;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout } = configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = getCookie(auth.logged_in);

  const { data: user, isLoading } = useUsers({ queryConfig: {} });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="text-primary-default animate-spin" />
      </div>
    );
  }

  if (!user && !isLoading && isLoggedIn != state.loggedIn) {
    return redirect(
      paths.home.getHref(window.location.pathname),
      RedirectType.replace,
    );
  }

  return children;
};
