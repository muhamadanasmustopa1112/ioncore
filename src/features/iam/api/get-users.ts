import { queryOptions, useQuery } from "@tanstack/react-query";
import { BaseListRequest } from "@/types/base";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { EmployeeListResponse } from "../types";
import { EMPLOYEE_KEYS } from "./keys";

export type EmployeeParam = {
  set_guid?: boolean;
  guid?: string;
  set_fullname?: boolean;
  fullname?: string;
  set_nickname?: boolean;
  nickname?: string;
  set_gender?: boolean;
  gender?: string;
  set_marital?: boolean;
  marital?: string;
  set_education?: boolean;
  education?: string;
  set_join_date?: boolean;
  join_date?: string;
  set_nik?: boolean;
  nik?: string;
  set_id_card?: boolean;
  id_card?: string;
  set_email?: boolean;
  email?: string;
  set_phone_number?: boolean;
  phone_number?: string;
  set_job_id?: boolean;
  job_id?: any[];
  set_department_id?: boolean;
  department_id?: string;
  set_group_id?: boolean;
  group_id?: string;
  set_brand_id?: boolean;
  brand_id?: string;
  set_status?: boolean;
  status?: string;
  outlet_id?: string;
  set_is_perbantuan?: boolean;
  is_perbantuan?: boolean;
  set_perbantuan_outlet_id?: boolean;
  perbantuan_outlet_id?: string;
};

export type EmployeeRequest = BaseListRequest<EmployeeParam>;

export const getEmployees = (
  request: EmployeeRequest,
): Promise<EmployeeListResponse> =>
  api.post(`${services.iam}/list`, request);

export const getEmployeesQueryOptions = (
  request: BaseListRequest<EmployeeParam>,
) =>
  queryOptions({
    queryKey: EMPLOYEE_KEYS.list({ ...request }),
    queryFn: () => getEmployees(request),
  });

type UseEmployeesOptions = {
  request: EmployeeRequest;
  queryConfig?: QueryConfig<typeof getEmployeesQueryOptions>;
};

export const useEmployees = ({ request, queryConfig }: UseEmployeesOptions) =>
  useQuery({
    ...getEmployeesQueryOptions(request),
    ...queryConfig,
  });
