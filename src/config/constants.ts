// auth
export const auth = {
  token: "token",
  token_expired: "token_expired",
  refresh_token: "refresh_token",
  refresh_token_expired: "refresh_token_expired",
  logged_in: "logged_in",
  user: "user",
  session_id: "session_id",
  active_branch_id: "active_branch_id",
};

// auth state
export const state = {
  loggedIn: "1",
};

// response
export const responses = {
  success: "Success",

  // token handling
  unauthorizedToken: "Unauthorized token",
  unauthorizedRefreshToken: "Unauthorized refresh token",
  pleaseLoginFirst: "Please login first",
  headerTokenNotFound: "Header `token` not found",
};

// services
export const services = {
  // mwx version
  // auth: "/auth-service",
  // hr: "/hr-services",
  // product: "/product-service",
  // cms: "/cms-service",
  // approval: "/approval-service",
  // media: "/media-service",
  // transaction: "/transaction-service",

  // alaya version
  auth: "/authorization",
  hr: "/hr-services",
  iam: "/iam-access",
  networking: "/ion-networking-service/api/v1",
  user: "/ion-user-service/api/v1",
  userOrigin: "/ion-user-service/api/v1",
  branch: "/ion-branch-service/api/v1",
  ruleScheme: "/ion-rule-scheme-service/api/v1",
  product: "/ion-product-service/api/v1",
  sales: "/ion-sales-service/api/v1",
  order: "/ion-order-service/api/v1",
  customer: "/ion-customer-service/api/v1",
  technical: "/ion-technical-service/api/v1",
};

// devices
export const devices = {
  web: "web",
  mobile: "mobile",
};

export const sidebarSide = {
  horizontal: "horizontal",
  vertical: "vertical",
};
