export type AuthUser = {
  authentication_guid?: string;
  users_guid?: string;
  merchant_guid?: string;
  customer_guid?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
  role?: Role;
  url_image?: string;
  last_login?: Date;
  fcm_token?: string;
  user_detail?: UserDetail;
};

export type Role = {
  guid?: string;
  name?: string;
};

export type UserDetail = {
  customer?: null;
  merchant?: null;
};
