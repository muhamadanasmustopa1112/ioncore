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
    resetPassword: {
      path: "/reset-password",
      getHref: () => "/reset-password",
    },
    changePassword: {
      path: "/change-password",
      getHref: (token?: string) =>
        `/change-password${token ? `?token=${encodeURIComponent(token)}` : ""}`,
    },
    logout: {
      path: "/logout",
      getHref: () => "/logout",
    },
  },
  profile: {
    path: "/profile",
    getHref: () => "/profile",
  },
  dashboard: {
    root: {
      path: "/dashboard",
      getHref: () => "/dashboard",
    },
    crmAndSales: {
      root: {
        path: "/crm-and-sales",
        getHref: () => "/crm-and-sales",
      },
      customer: {
        detail: {
          path: "/crm-and-sales/:customerId",
          getHref: (customerId: string) => `/crm-and-sales/${customerId}`,
        },
      },
      leads: {
        root: {
          path: "/crm-and-sales/leads",
          getHref: () => "/crm-and-sales/leads",
        },
        detail: {
          path: "/crm-and-sales/leads/:id",
          getHref: (id: string) => `/crm-and-sales/leads/${id}`,
        },
      },
    },
    networkAndOrchestration: {
      root: {
        path: "/noc",
        getHref: () => "/noc",
      },
      radius: {
        dashboard: {
          path: "/noc/ion-radius/dashboard",
          getHref: () => "/noc/ion-radius/dashboard",
        },
      },
      router: {
        path: "/noc/ion-radius/router",
        getHref: () => "/noc/ion-radius/router",
      },
      customer: {
        root: {
          path: "/noc/ion-radius/customer",
          getHref: () => "/noc/ion-radius/customer",
        },
        create: {
          path: "/noc/ion-radius/customer/create",
          getHref: () => "/noc/ion-radius/customer/create",
        },
        edit: {
          path: "/noc/ion-radius/customer/edit/:id",
          getHref: (id: string) => `/noc/ion-radius/customer/edit/${id}`,
        },
        detail: {
          path: "/noc/ion-radius/customer/detail/:id",
          getHref: (id: string) => `/noc/ion-radius/customer/detail/${id}`,
        },
      },
      servicePlan: {
        root: {
          path: "/noc/ion-radius/service-plan",
          getHref: () => "/noc/ion-radius/service-plan",
        },
        bandwidth: {
          path: "/noc/ion-radius/service-plan/bandwidth",
          getHref: () => "/noc/ion-radius/service-plan/bandwidth",
        },
        profileGroup: {
          path: "/noc/ion-radius/service-plan/profile-group",
          getHref: () => "/noc/ion-radius/service-plan/profile-group",
        },
        pppProfile: {
          path: "/noc/ion-radius/service-plan/ppp-profile",
          getHref: () => "/noc/ion-radius/service-plan/ppp-profile",
        },
      },
      odpPop: {
        root: {
          path: "/noc/odp-pop",
          getHref: () => "/noc/odp-pop",
        },
        manage: {
          path: "/noc/odp-pop/manage",
          getHref: () => "/noc/odp-pop/manage",
          detail: {
            path: "/noc/odp-pop/manage/detail/:id",
            getHref: (id: string) => `/noc/odp-pop/manage/detail/${id}`,
          },
        },
        map: {
          path: "/noc/odp-pop/map",
          getHref: () => "/noc/odp-pop/map",
        },
        oltDetail: {
          path: "/noc/odp-pop/olt/:id",
          getHref: (id: string) => `/noc/odp-pop/olt/${id}`,
        },
      },
    },

    technician: {
      root: {
        path: "/technician",
        getHref: () => "/technician",
      },
      detail: {
        path: "/technician/:id",
        getHref: (id: string) => `/technician/${id}`,
      },
      teamPairing: {
        path: "/technician/team-pairing",
        getHref: () => "/technician/team-pairing",
      },
      nocQueue: {
        path: "/technician/noc-queue",
        getHref: () => "/technician/noc-queue",
      },
    },
    warehouse: {
      root: {
        path: "/warehouse",
        getHref: () => "/warehouse",
      },
    },
    operations: {
      root: {
        path: "/operations",
        getHref: () => "/operations",
      },
      workOrders: {
        root: {
          path: "/operations/work-orders",
          getHref: () => "/operations/work-orders",
        },
        detail: {
          path: "/operations/work-orders/:id",
          getHref: (id: string) => `/operations/work-orders/${id}`,
        },
      },
      orders: {
        root: {
          path: "/operations/orders",
          getHref: () => "/operations/orders",
        },
      },
      connectivity: {
        path: "/operations/connectivity/:id",
        getHref: (id: string) => `/operations/connectivity/${id}`,
      },
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
    administration: {
      branch: {
        root: {
          path: "/administration/branch",
          getHref: () => "/administration/branch",
        },
        capability: {
          path: "/administration/branch/capability",
          getHref: () => "/administration/branch/capability",
        },
        coverage: {
          path: "/administration/branch/coverage",
          getHref: () => "/administration/branch/coverage",
        },
        policy: {
          path: "/administration/branch/policy",
          getHref: () => "/administration/branch/policy",
        },
        crossBranchRules: {
          path: "/administration/branch/cross-branch-rules",
          getHref: () => "/administration/branch/cross-branch-rules",
        },
        resourceMapping: {
          path: "/administration/branch/resource-mapping",
          getHref: () => "/administration/branch/resource-mapping",
        },
        accessScope: {
          path: "/administration/branch/access-scope",
          getHref: () => "/administration/branch/access-scope",
        },
        performance: {
          path: "/administration/branch/performance",
          getHref: () => "/administration/branch/performance",
        },
      },
      roles: {
        root: {
          path: "/administration/roles",
          getHref: () => "/administration/roles",
        },
      },
      users: {
        root: {
          path: "/administration/users",
          getHref: () => "/administration/users",
        },
      },
      schema: {
        root: {
          path: "/administration/schema",
          getHref: () => "/administration/schema",
        },
      },
      products: {
        root: {
          path: "/administration/products",
          getHref: () => "/administration/products",
        },
      },
      checklist: {
        root: {
          path: "/administration/checklist",
          getHref: () => "/administration/checklist",
        },
        templates: {
          path: "/administration/checklist/templates",
          getHref: () => "/administration/checklist/templates",
        },
        overrides: {
          path: "/administration/checklist/overrides",
          getHref: () => "/administration/checklist/overrides",
        },
        versioning: {
          path: "/administration/checklist/versioning",
          getHref: () => "/administration/checklist/versioning",
        },
        binding: {
          path: "/administration/checklist/binding",
          getHref: () => "/administration/checklist/binding",
        },
      },
      platformConfig: {
        path: "/administration/platform-config",
        getHref: () => "/administration/platform-config",
      },
      masterData: {
        path: "/administration/master-data",
        getHref: () => "/administration/master-data",
      },
      auditLog: {
        path: "/administration/audit-log",
        getHref: () => "/administration/audit-log",
      },
      accessPolicies: {
        path: "/administration/access-policies",
        getHref: () => "/administration/access-policies",
      },
      compliance: {
        path: "/administration/compliance",
        getHref: () => "/administration/compliance",
      },
      leadIngestion: {
        path: "/administration/lead-ingestion",
        getHref: () => "/administration/lead-ingestion",
      },
      duplicateReview: {
        path: "/administration/duplicate-review",
        getHref: () => "/administration/duplicate-review",
      },
      menuVisibility: {
        path: "/administration/menu-visibility",
        getHref: () => "/administration/menu-visibility",
      },
      approvalPolicy: {
        path: "/administration/approval-policy",
        getHref: () => "/administration/approval-policy",
      },
      accessException: {
        path: "/administration/access-exception",
        getHref: () => "/administration/access-exception",
      },
      sodRules: {
        path: "/administration/sod-rules",
        getHref: () => "/administration/sod-rules",
      },
      securityPolicy: {
        path: "/administration/security-policy",
        getHref: () => "/administration/security-policy",
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
    s3Test: {
      path: "/docs/s3-test",
      getHref: () => "/docs/s3-test",
    },
  },
};
