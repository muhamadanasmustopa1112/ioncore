export const POP_KEYS = {
    all: () => ["POP"],
    root: () => ["POP"],
    list: (args?: any) => ["POP", "LIST", { ...(args || {}) }],
    detail: (id: string) => ["POP", "DETAIL", id],
    create: () => ["POP", "CREATE"],
    update: (id: string) => ["POP", "UPDATE", id],
    delete: (id: string) => ["POP", "DELETE", id],
};

export const OLT_KEYS = {
    all: () => ["OLT"],
    root: () => ["OLT"],
    list: (args?: any) => ["OLT", "LIST", { ...(args || {}) }],
    detail: (id: string) => ["OLT", "DETAIL", id],
};

export const ODP_KEYS = {
    all: () => ["ODP"],
    root: () => ["ODP"],
    list: (args?: any) => ["ODP", "LIST", { ...(args || {}) }],
    detail: (id: string) => ["ODP", "DETAIL", id],
};
