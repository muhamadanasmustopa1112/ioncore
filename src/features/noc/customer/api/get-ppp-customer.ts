import { useQuery, queryOptions } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { PPP_CUSTOMER_KEYS } from "./keys";
import { PPPCustomer } from "../types";



export const getPPPCustomer = (id: string): Promise<PPPCustomer> => {

  return api.get(`${services.networking}/ion-radius/customers/ppp-users/${id}`);
};

export const getPPPCustomerQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: PPP_CUSTOMER_KEYS.detail(id),
    queryFn: () => getPPPCustomer(id),
  });
};

type UsePPPCustomerOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPPPCustomerQueryOptions>;
};

export const useGetPPPCustomer = ({ id, queryConfig }: UsePPPCustomerOptions) => {
  return useQuery({
    ...getPPPCustomerQueryOptions(id),
    ...queryConfig,
    enabled: !!id,
  });
};
