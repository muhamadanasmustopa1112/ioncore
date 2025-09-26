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
      twoColumn: {
        path: "/human-resources/employee/two-column",
        getHref: () => "/human-resources/employee/list/two-columns",
      },
      twoColumnCard: {
        path: "/human-resources/employee/two-column-card",
        getHref: () => "/human-resources/employee/list/two-columns/card",
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
