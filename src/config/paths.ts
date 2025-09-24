export const paths = {
  home: {
    path: "/",
    getHref: (redirectTo?: string) =>
      `/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  auth: {
    signin: {
      path: "/signin",
      getHref: (redirectTo?: string) =>
        `/signin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
  },
  dashboard: {
    root: {
      path: "/dashboard",
      getHref: () => "/dashboard",
    },
    employee: {
      list: {
        path: "/human-resources/employee/list",
        getHref: () => "/human-resources/employee/list",
      },
    },
    application: {
      path: "/dashboard/application",
      getHref: () => "/dashboard/application",
    },
    transaction: {
      path: "/dashboard/transaction",
      getHref: () => "/dashboard/transaction",
    },
  },
};
