"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { useFcm } from "@/hooks/use-fcm";

const queryClient = getQueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {

  const { token } = useFcm();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};


export default Provider;
