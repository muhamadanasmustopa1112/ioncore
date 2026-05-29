import { queryOptions, useQuery } from "@tanstack/react-query";
import { CALENDAR_KEYS } from "./keys";
import { DUMMY_CALENDAR_EVENTS } from "../data/dummy-calendar-events";
import type { CalendarEvent, CalendarParams, CalendarResponse } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getCalendarEvents = async (params: CalendarParams): Promise<CalendarResponse> => {
  await delay(300);

  let filteredData: CalendarEvent[] = [...DUMMY_CALENDAR_EVENTS];

  if (params.month) {
    filteredData = filteredData.filter((event) => {
      const eventMonth = event.start_date.substring(0, 7);
      const endMonth = event.end_date.substring(0, 7);
      return eventMonth === params.month || endMonth === params.month;
    });
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredData = filteredData.filter((event) =>
      event.title.toLowerCase().includes(searchLower),
    );
  }

  if (params.event_type) {
    filteredData = filteredData.filter((event) => event.event_type === params.event_type);
  }

  if (params.area_id) {
    filteredData = filteredData.filter((event) =>
      event.affected_areas.some((area) => area.area_id === params.area_id),
    );
  }

  filteredData.sort((a, b) => a.start_date.localeCompare(b.start_date));

  const start = params.start || 0;
  const length = params.length || filteredData.length;
  const paginatedData = filteredData.slice(start, start + length);

  return {
    data: paginatedData,
    metadata: {
      total_data: filteredData.length,
      total_page: Math.ceil(filteredData.length / length),
    },
  };
};

export const getCalendarQueryOptions = (params: CalendarParams) => {
  return queryOptions({
    queryKey: CALENDAR_KEYS.list(params),
    queryFn: () => getCalendarEvents(params),
    staleTime: 5 * 60 * 1000,
  });
};

type UseCalendarEventsOptions = {
  params: CalendarParams;
};

export const useCalendarEvents = ({ params }: UseCalendarEventsOptions) => {
  return useQuery({
    ...getCalendarQueryOptions(params),
  });
};
