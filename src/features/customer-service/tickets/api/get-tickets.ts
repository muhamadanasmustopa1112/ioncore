import { queryOptions, useQuery } from "@tanstack/react-query";
import { TICKET_KEYS } from "./keys";
import { DUMMY_TICKETS } from "../../data/dummy-tickets";
import type { Ticket, TicketListParams, TicketListResponse } from "../../types";

const getTickets = async (params: TicketListParams): Promise<TicketListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredData: Ticket[] = [...DUMMY_TICKETS];

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredData = filteredData.filter(
      (ticket) =>
        ticket.ticket_number.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        (ticket.customer_name && ticket.customer_name.toLowerCase().includes(searchLower))
    );
  }

  if (params.status) {
    filteredData = filteredData.filter((ticket) => ticket.status === params.status);
  }

  if (params.ticket_type) {
    filteredData = filteredData.filter((ticket) => ticket.ticket_type === params.ticket_type);
  }

  if (params.priority) {
    filteredData = filteredData.filter((ticket) => ticket.priority === params.priority);
  }

  if (params.channel) {
    filteredData = filteredData.filter((ticket) => ticket.channel === params.channel);
  }

  const start = params.start || 0;
  const length = params.length || 10;
  const paginatedData = filteredData.slice(start, start + length);

  return {
    data: paginatedData,
    metadata: {
      total_data: filteredData.length,
      total_page: Math.ceil(filteredData.length / length),
    },
  };
};

export const getTicketsQueryOptions = (params: TicketListParams) => {
  return queryOptions({
    queryKey: TICKET_KEYS.list(params),
    queryFn: () => getTickets(params),
    staleTime: 5 * 60 * 1000,
  });
};

type UseTicketsOptions = {
  params: TicketListParams;
  queryConfig?: Record<string, unknown>;
};

export const useTickets = ({ params, queryConfig }: UseTicketsOptions) => {
  return useQuery({
    ...getTicketsQueryOptions(params),
    ...queryConfig,
  });
};
