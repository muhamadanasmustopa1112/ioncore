import { queryOptions, useQuery } from "@tanstack/react-query";
import { TICKET_KEYS } from "./keys";
import { DUMMY_TICKETS } from "../../data/dummy-tickets";
import type { Ticket } from "../../types";

const getTicketById = async (id: string): Promise<Ticket | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DUMMY_TICKETS.find((ticket) => ticket.id === id) ?? null;
};

export const getTicketQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: TICKET_KEYS.detail(id),
    queryFn: () => getTicketById(id),
    staleTime: 5 * 60 * 1000,
  });
};

type UseTicketOptions = {
  id: string;
  queryConfig?: Record<string, unknown>;
};

export const useTicket = ({ id, queryConfig }: UseTicketOptions) => {
  return useQuery({
    ...getTicketQueryOptions(id),
    ...queryConfig,
  });
};
