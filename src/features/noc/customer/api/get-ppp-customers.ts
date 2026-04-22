import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { PPP_CUSTOMER_KEYS } from "./keys";
import { PPP_CUSTOMER_PARAMS, PPP_CUSTOMER_RESPONSE } from "../types";

export const getPPPCustomers = (params: PPP_CUSTOMER_PARAMS): Promise<PPP_CUSTOMER_RESPONSE> => {
  return api.get(`${services.networking}/ion-radius/customers/ppp-users/`, {
    params,
  });
};

export const getPPPCustomersQueryOptions = (params: PPP_CUSTOMER_PARAMS) => {
  return queryOptions({
    queryKey: PPP_CUSTOMER_KEYS.list(params),
    queryFn: () => getPPPCustomers(params),
  });
};

type UsePPPCustomersOptions = {
  params: PPP_CUSTOMER_PARAMS;
  queryConfig?: QueryConfig<typeof getPPPCustomersQueryOptions>;
};

export const usePPPCustomers = ({ params, queryConfig }: UsePPPCustomersOptions) => {
  return useQuery({
    ...getPPPCustomersQueryOptions(params),
    ...queryConfig,
  });
};
