import { BaseResponse } from "@/types/base";

export type Employee = {
  guid?: string;
  fullname?: string;
  nickname?: string;
  religion?: string;
  date_of_birth?: Date;
  place_of_birth?: string;
  gender?: string;
  address_id_card?: null;
  address_domicile?: null;
  marital_status?: string;
  education?: string;
  email?: string;
  phone_number?: string;
  id_card?: null;
  npwp?: null;
  bank_name?: null;
  bank_account?: null;
  insurance_number?: null;
  insurance_institution?: null;
  bpjs_ketenagakerjaan?: null;
  url_profile_picture?: string;
  about_me?: string;
  skills?: string[];
  interests?: string;
  expertise?: string;
  cv_file_url?: string;
  url_social_media?: any[];
  job?: Job;
  outlet?: Outlet;
  status?: string;
  is_perbantuan?: boolean;
  perbantuan_outlet_id?: null;
  outlet_perbantuan?: null;
  init_leave_qty?: number;
  leave_qty?: number;
  created_at?: Date;
  created_by?: string;
  updated_at?: null;
  updated_by?: null;
  deleted_at?: null;
  deleted_by?: null;
};

export type Job = {
  join_date?: string;
  nik?: null;
  job_id?: string;
  job_name?: string;
  department_id?: string;
  department_name?: null;
};

export type Outlet = {
  outlet_id?: string;
  outlet_name?: string;
  brand_id?: string;
  brand_name?: string;
  sub_brand_id?: string;
  sub_brand_name?: string;
  group_id?: string;
  group_name?: string;
};

// Response
export type EmployeeListResponse = BaseResponse<Employee[]>;
