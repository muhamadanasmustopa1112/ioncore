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
    user: {
      root: {
        path: "/users",
        getHref: () => "/users",
      },
    },
    role: {
      root: {
        path: "/users/role",
        getHref: () => "/users/role",
      },
    },
    employees: {
      root: {
        path: "/users/employee",
        getHref: () => "/users/employee",
      },
    },
    department: {
      root: {
        path: "/users/employees/department",
        getHref: () => "/users/employees/department",
      },
    },
    division: {
      root: {
        path: "/users/employees/division",
        getHref: () => "/users/employees/division",
      },
    },
    position: {
      root: {
        path: "/users/employees/position",
        getHref: () => "/users/employees/position",
      },
    },
    employee: {
      root: {
        path: "/users/employees/employee",
        getHref: () => "/users/employees/employee",
      },
    },
    accessManagement: {
      root: {
        path: "/users/employees/access-management",
        getHref: () => "/users/employees/access-management",
      },
    },
  },
  docs: {
    root: {
      path: "/docs/dashboard",
      getHref: () => "/docs/dashboard",
    },
    masterData: {
      root: {
        path: "/docs/master-data",
        getHref: () => "/docs/master-data",
      },
    },
    oneColDrawer: {
      root: {
        path: "/docs/master-data/one-col-drawer",
        getHref: () => "/docs/master-data/one-col-drawer",
      },
    },
    oneColNewPage: {
      root: {
        path: "/docs/master-data/one-col-new-page",
        getHref: () => "/docs/master-data/one-col-new-page",
      },
      detail: {
        path: "/docs/master-data/one-col-new-page/detail/:id",
        getHref: (id: string) => `/docs/master-data/one-col-new-page/detail/${id}`,
      },
      create: {
        path: "/docs/master-data/one-col-new-page/create",
        getHref: () => "/docs/master-data/one-col-new-page/create",
      },
      update: {
        path: "/docs/master-data/one-col-new-page/update/:id",
        getHref: (id: string) => `/docs/master-data/one-col-new-page/update/${id}`,
      },
    },
    oneColToTwoCol: {
      root: {
        path: "/docs/master-data/one-col-to-two-col",
        getHref: () => "/docs/master-data/one-col-to-two-col",
      },
    },
    twoColTwoCard: {
      root: {
        path: "/docs/master-data/two-col-two-card",
        getHref: () => "/docs/master-data/two-col-two-card",
      }
    },
    project: {
      root: {
        path: "/docs/project",
        getHref: () => "/docs/project",
      },
    },
    kanban: {
      root: {
        path: "/docs/project/kanban",
        getHref: () => "/docs/project/kanban",
      },
    },
    employee: {
      list: {
        path: "/docs/human-resources/employee/list",
        getHref: () => "/docs/human-resources/employee/list",
      },
      twoColumn: {
        path: "/docs/human-resources/employee/two-column",
        getHref: () => "/docs/human-resources/employee/list/two-columns",
      },
      twoColumnCard: {
        path: "/docs/human-resources/employee/two-column-card",
        getHref: () => "/docs/human-resources/employee/list/two-columns/card",
      },
      detail: {
        path: "/docs/human-resources/employee/detail/:id",
        getHref: (id: string) => `/docs/human-resources/employee/detail/${id}`,
      },
    },
    application: {
      path: "/docs/dashboard/application",
      getHref: () => "/docs/dashboard/application",
    },
    transaction: {
      path: "/docs/dashboard/transaction",
      getHref: () => "/docs/dashboard/transaction",
    },
  },
};
