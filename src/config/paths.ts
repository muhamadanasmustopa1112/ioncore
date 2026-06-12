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
        root: {
          path: "/crm-and-sales/customers",
          getHref: () => "/crm-and-sales/customers",
        },
        create: {
          path: "/crm-and-sales/customers/create",
          getHref: () => "/crm-and-sales/customers/create",
        },
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
        create: {
          path: "/crm-and-sales/leads/create",
          getHref: () => "/crm-and-sales/leads/create",
        },
        detail: {
          path: "/crm-and-sales/leads/:id",
          getHref: (id: string) => `/crm-and-sales/leads/${id}`,
        },
        convert: {
          path: "/crm-and-sales/leads/:id/convert",
          getHref: (id: string) => `/crm-and-sales/leads/${id}/convert`,
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
      dashboard: {
        path: "/technician/dashboard",
        getHref: () => "/technician/dashboard",
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
      stock: {
        root: {
          path: "/warehouse/stock",
          getHref: () => "/warehouse/stock",
        },
        detail: {
          path: "/warehouse/stock/:id",
          getHref: (id: string) => `/warehouse/stock/${id}`,
        },
      },
      dispatch: {
        root: {
          path: "/warehouse/dispatch",
          getHref: () => "/warehouse/dispatch",
        },
        detail: {
          path: "/warehouse/dispatch/:id",
          getHref: (id: string) => `/warehouse/dispatch/${id}`,
        },
      },
      receive: {
        root: {
          path: "/warehouse/receive",
          getHref: () => "/warehouse/receive",
        },
      },
      transfers: {
        root: {
          path: "/warehouse/transfers",
          getHref: () => "/warehouse/transfers",
        },
        detail: {
          path: "/warehouse/transfers/:id",
          getHref: (id: string) => `/warehouse/transfers/${id}`,
        },
      },
      opname: {
        root: {
          path: "/warehouse/opname",
          getHref: () => "/warehouse/opname",
        },
        detail: {
          path: "/warehouse/opname/:id",
          getHref: (id: string) => `/warehouse/opname/${id}`,
        },
      },
      returns: {
        root: {
          path: "/warehouse/returns",
          getHref: () => "/warehouse/returns",
        },
        detail: {
          path: "/warehouse/returns/:id",
          getHref: (id: string) => `/warehouse/returns/${id}`,
        },
      },
      reports: {
        root: {
          path: "/warehouse/reports",
          getHref: () => "/warehouse/reports",
        },
      },
      inventoryConfig: {
        root: {
          path: "/warehouse/inventory-config",
          getHref: () => "/warehouse/inventory-config",
        },
      },
    },
    operations: {
      root: {
        path: "/operations",
        getHref: () => "/operations",
      },
      plannedMaintenance: {
        root: {
          path: "/operations/planned-maintenance",
          getHref: () => "/operations/planned-maintenance",
        },
        create: {
          path: "/operations/planned-maintenance/create",
          getHref: () => "/operations/planned-maintenance/create",
        },
        detail: {
          path: "/operations/planned-maintenance/:id",
          getHref: (id: string) => `/operations/planned-maintenance/${id}`,
        },
        edit: {
          path: "/operations/planned-maintenance/:id/edit",
          getHref: (id: string) => `/operations/planned-maintenance/${id}/edit`,
        },
      },
      bulkOperations: {
        root: {
          path: "/operations/bulk-operations",
          getHref: () => "/operations/bulk-operations",
        },
        detail: {
          path: "/operations/bulk-operations/:id",
          getHref: (id: string) => `/operations/bulk-operations/${id}`,
        },
      },
      calendar: {
        root: {
          path: "/operations/calendar",
          getHref: () => "/operations/calendar",
        },
      },
      announcements: {
        root: {
          path: "/operations/announcements",
          getHref: () => "/operations/announcements",
        },
        create: {
          path: "/operations/announcements/create",
          getHref: () => "/operations/announcements/create",
        },
        detail: {
          path: "/operations/announcements/:id",
          getHref: (id: string) => `/operations/announcements/${id}`,
        },
      },
      slaMonitoring: {
        root: {
          path: "/operations/sla-monitoring",
          getHref: () => "/operations/sla-monitoring",
        },
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
    customerService: {
      root: {
        path: "/customer-service",
        getHref: () => "/customer-service",
      },
      tickets: {
        root: {
          path: "/customer-service/tickets",
          getHref: () => "/customer-service/tickets",
        },
        detail: {
          path: "/customer-service/tickets/:id",
          getHref: (id: string) => `/customer-service/tickets/${id}`,
        },
      },
      csat: {
        root: {
          path: "/customer-service/csat",
          getHref: () => "/customer-service/csat",
        },
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
    finance: {
      root: {
        path: "/finance",
        getHref: () => "/finance",
      },
      invoice: {
        root: {
          path: "/finance/invoices",
          getHref: () => "/finance/invoices",
        },
        create: {
          path: "/finance/invoices/create",
          getHref: () => "/finance/invoices/create",
        },
        detail: {
          path: "/finance/invoices/:id",
          getHref: (id: string) => `/finance/invoices/${id}`,
        },
      },
      payment: {
        root: {
          path: "/finance/payments",
          getHref: () => "/finance/payments",
        },
        detail: {
          path: "/finance/payments/:id",
          getHref: (id: string) => `/finance/payments/${id}`,
        },
      },
      suspension: {
        root: {
          path: "/finance/suspensions",
          getHref: () => "/finance/suspensions",
        },
      },
      commission: {
        root: {
          path: "/finance/commissions",
          getHref: () => "/finance/commissions",
        },
      },
      report: {
        root: {
          path: "/finance/reports",
          getHref: () => "/finance/reports",
        },
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
      customerTypes: {
        path: "/administration/customer-types",
        getHref: () => "/administration/customer-types",
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
      permissions: {
        path: "/administration/permissions",
        getHref: () => "/administration/permissions",
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
      approvals: {
        path: "/administration/approvals",
        getHref: () => "/administration/approvals",
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
    enterprise: {
      root: {
        path: "/enterprise",
        getHref: () => "/enterprise",
      },
      dashboard: {
        path: "/enterprise/dashboard",
        getHref: () => "/enterprise/dashboard",
      },
      vendors: {
        root: {
          path: "/enterprise/vendors",
          getHref: () => "/enterprise/vendors",
        },
        create: {
          path: "/enterprise/vendors/create",
          getHref: () => "/enterprise/vendors/create",
        },
        detail: {
          path: "/enterprise/vendors/:id",
          getHref: (id: string) => `/enterprise/vendors/${id}`,
        },
        edit: {
          path: "/enterprise/vendors/:id/edit",
          getHref: (id: string) => `/enterprise/vendors/${id}/edit`,
        },
      },
      projects: {
        root: {
          path: "/enterprise/projects",
          getHref: () => "/enterprise/projects",
        },
        create: {
          path: "/enterprise/projects/create",
          getHref: () => "/enterprise/projects/create",
        },
        detail: {
          path: "/enterprise/projects/:id",
          getHref: (id: string) => `/enterprise/projects/${id}`,
        },
        edit: {
          path: "/enterprise/projects/:id/edit",
          getHref: (id: string) => `/enterprise/projects/${id}/edit`,
        },
      },
      cpq: {
        root: {
          path: "/enterprise/cpq",
          getHref: () => "/enterprise/cpq",
        },
        preBoq: {
          path: "/enterprise/cpq/pre-boq",
          getHref: () => "/enterprise/cpq/pre-boq",
        },
        rfq: {
          path: "/enterprise/cpq/rfq",
          getHref: () => "/enterprise/cpq/rfq",
        },
        boq: {
          path: "/enterprise/cpq/boq",
          getHref: () => "/enterprise/cpq/boq",
        },
        quotation: {
          path: "/enterprise/cpq/quotation",
          getHref: () => "/enterprise/cpq/quotation",
        },
      },
      icPo: {
        root: {
          path: "/enterprise/ic-po",
          getHref: () => "/enterprise/ic-po",
        },
        detail: {
          path: "/enterprise/ic-po/:id",
          getHref: (id: string) => `/enterprise/ic-po/${id}`,
        },
      },
      resellers: {
        root: {
          path: "/enterprise/resellers",
          getHref: () => "/enterprise/resellers",
        },
        create: {
          path: "/enterprise/resellers/create",
          getHref: () => "/enterprise/resellers/create",
        },
        detail: {
          path: "/enterprise/resellers/:id",
          getHref: (id: string) => `/enterprise/resellers/${id}`,
        },
      },
      ewo: {
        root: {
          path: "/enterprise/ewo",
          getHref: () => "/enterprise/ewo",
        },
        create: {
          path: "/enterprise/ewo/create",
          getHref: () => "/enterprise/ewo/create",
        },
        detail: {
          path: "/enterprise/ewo/:id",
          getHref: (id: string) => `/enterprise/ewo/${id}`,
        },
      },
      settlement: {
        root: {
          path: "/enterprise/settlement",
          getHref: () => "/enterprise/settlement",
        },
        detail: {
          path: "/enterprise/settlement/:id",
          getHref: (id: string) => `/enterprise/settlement/${id}`,
        },
      },
    },
    warRoom: {
      root: {
        path: "/war-room",
        getHref: () => "/war-room",
      },
      detail: {
        path: "/war-room/:id",
        getHref: (id: string) => `/war-room/${id}`,
      },
      tasks: {
        path: "/war-room/tasks",
        getHref: () => "/war-room/tasks",
      },
      pir: {
        path: "/war-room/pir",
        getHref: () => "/war-room/pir",
      },
      broadcasts: {
        path: "/war-room/broadcasts",
        getHref: () => "/war-room/broadcasts",
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
