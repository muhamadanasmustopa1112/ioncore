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
    masterData: {
      root: {
        path: "/master-data",
        getHref: () => "/master-data",
      },
    },
    oneColDrawer: {
      root: {
        path: "/master-data/one-col-drawer",
        getHref: () => "/master-data/one-col-drawer",
      },
    },
    oneColNewPage: {
      root: {
        path: "/master-data/one-col-new-page",
        getHref: () => "/master-data/one-col-new-page",
      },
      detail: {
        path: "/master-data/one-col-new-page/detail/:id",
        getHref: (id: string) => `/master-data/one-col-new-page/detail/${id}`,
      },
      create: {
        path: "/master-data/one-col-new-page/create",
        getHref: () => "/master-data/one-col-new-page/create",
      },
      update: {
        path: "/master-data/one-col-new-page/update/:id",
        getHref: (id: string) => `/master-data/one-col-new-page/update/${id}`,
      },
    },
    oneColToTwoCol: {
      root: {
        path: "/master-data/one-col-to-two-col",
        getHref: () => "/master-data/one-col-to-two-col",
      },
    },
    twoColTwoCard: {
      root: {
        path: "/master-data/two-col-two-card",
        getHref: () => "/master-data/two-col-two-card",
      }
    },
    project: {
      root: {
        path: "/project",
        getHref: () => "/project",
      },
    },
    kanban: {
      root: {
        path: "/project/kanban",
        getHref: () => "/project/kanban",
      },
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
      detail: {
        path: "/human-resources/employee/detail/:id",
        getHref: (id: string) => `/human-resources/employee/detail/${id}`,
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
