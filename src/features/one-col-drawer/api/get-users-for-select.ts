import { useInfiniteQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { EMPLOYEE_KEYS } from "./keys";

export interface EmployeeSelectOption {
  guid: string;
  fullname: string;
}

export interface EmployeeSelectResponse {
  message: string;
  response: {
    data: EmployeeSelectOption[];
    total_data: number;
    total_page: number;
    current_page: number;
  };
}

export interface EmployeeSelectRequest {
  filter: {
    set_fullname: boolean;
    fullname: string;
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export const getEmployeesForSelect = (
  request: EmployeeSelectRequest
): Promise<EmployeeSelectResponse> =>
  api.post(`${services.hr}/employee/list`, request);

interface UseEmployeesForSelectParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const useEmployeesForSelect = ({
  search = "",
  page = 1,
  limit = 20,
}: UseEmployeesForSelectParams) => {
  return useInfiniteQuery({
    queryKey: EMPLOYEE_KEYS.select(search),
    queryFn: async ({ pageParam = 1 }) => {
      const request: EmployeeSelectRequest = {
        filter: {
          set_fullname: !!search,
          fullname: search,
        },
        limit,
        page: pageParam,
        order: "fullname",
        sort: "ASC",
      };

      const response = await getEmployeesForSelect(request);
      return {
        data: response.response.data,
        currentPage: response.response.current_page,
        totalPages: response.response.total_page,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
