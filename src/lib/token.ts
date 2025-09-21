/*
	Installed from github/Few-IT/few-it-registries/tree/master
*/

import Axios from "axios";
import { nanoid } from "nanoid";
import { BaseResponse } from "@/types/base";
import { auth, responses, services } from "@/config/constants";
import { env } from "@/config/env";
import { getCookie, setCookie } from "./cookies";

const DEVICE_TYPE = "Web";
const apiToken = Axios.create({
  baseURL: env.API_URL,
});

export type GenerateToken = {
  name?: string;
  device_id?: string;
  device_type?: string;
  token?: string;
  token_expired?: string;
  refresh_token?: string;
  refresh_token_expired?: string;
  is_login?: boolean;
  user_login?: string;
};

// generate token
export const generateToken = async () => {
  const device_id = `${Date.now()}-${nanoid(10)}`;
  const body = {
    app_name: env.SERVICE_NAME,
    app_key: env.SECRET_KEY,
    device_id,
    device_type: DEVICE_TYPE,
    fcm_token: "",
    ip_address: "0.0.0.0",
  };
  const response = await apiToken.post<BaseResponse<GenerateToken>>(
    `${services.auth}/token/auth`,
    body,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (
    response?.data?.response?.message_en === responses.success &&
    response?.data?.response?.data
  ) {
    saveToCookies(response?.data?.response?.data);
    return response?.data?.response?.data;
  }

  return null;
};

// refresh token
export const refreshToken = async () => {
  const token = getCookie(auth.refresh_token);

  const response = await apiToken.get<BaseResponse<GenerateToken>>(
    `${services.auth}/token/refresh`,
    {
      headers: {
        "refresh-token": token,
      },
    },
  );

  if (
    response?.data?.response?.message_en === responses.success &&
    response?.data?.response?.data
  ) {
    saveToCookies(response?.data?.response?.data);
    return response?.data?.response?.data;
  }

  return null;
};

const saveToCookies = (data: GenerateToken) => {
  const tokenExpired = data?.token_expired
    ? new Date(`${data?.token_expired}Z`)
    : new Date();
  const refreshTokenExpired = data?.refresh_token_expired
    ? new Date(`${data?.refresh_token_expired}Z`)
    : new Date();
  setCookie(auth.token, data?.token || "", tokenExpired);
  setCookie(auth.refresh_token, data?.refresh_token || "", refreshTokenExpired);
};
