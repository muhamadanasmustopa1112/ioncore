// MWX Version
// export type AuthUser = {
//   authentication_guid?: string;
//   users_guid?: string;
//   merchant_guid?: string;
//   customer_guid?: string;
//   username?: string;
//   email?: string;
//   phone_number?: string;
//   is_active?: boolean;
//   role?: Role;
//   url_image?: string;
//   last_login?: Date;
//   fcm_token?: string;
//   user_detail?: UserDetail;
// };

// export type Role = {
//   guid?: string;
//   name?: string;
// };

// export type UserDetail = {
//   customer?: null;
//   merchant?: null;
// };

// Alaya Version
export type AuthUser = {
  guid?: string;
  users_guid?: string;
  username?: string;
  roles?: Roles;
  employee_detail?: EmployeeDetail;
  customer_detail?: null;
  is_active?: boolean;
  fcm_token?: null;
  created_at?: Date;
  created_by?: string;
};

export type EmployeeDetail = {
  guid?: string;
  fullname?: string;
  email?: string;
  phone_number?: string;
  job?: Job;
  outlet?: Outlet;
  status?: string;
};

export type Job = {
  join_date?: Date;
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

export type Roles = {
  guid?: string;
  name?: string;
};
