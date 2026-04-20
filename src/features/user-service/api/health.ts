import { useQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import type { UserServiceEnvelope } from "../types";

export const getUserServiceHealth = () =>
  userServiceApi.get<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${services.userOrigin}/health`,
  );

export const useUserServiceHealth = (enabled = true) =>
  useQuery({
    queryKey: ["user-service", "health"],
    queryFn: () => getUserServiceHealth(),
    enabled,
    retry: false,
  });
