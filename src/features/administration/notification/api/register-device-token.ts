import { api } from "@/lib/api-client";
import { services } from "@/config/constants";
import { RegisterDeviceTokenParams, RegisterDeviceTokenResponse } from "../types/notification";


export const registerDeviceToken = (
  body: RegisterDeviceTokenParams
): Promise<RegisterDeviceTokenResponse> => {
  return api.post(`${services.notification}/device-tokens/register`, body);
};
