// auth
export const auth = {
  token: "token",
  token_expired: "token_expired",
  refresh_token: "refresh_token",
  refresh_token_expired: "refresh_token_expired",
  logged_in: "logged_in",
  user: "user",
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
};

// devices
export const devices = {
  web: "web",
  mobile: "mobile",
};
