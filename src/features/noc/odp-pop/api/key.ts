export const POP_KEYS = {
    root: () => ["POP"],
    list: (args?: any) => [POP_KEYS.root(), "LIST", { ...(args || {}) }],
    detail: (id: string) => [POP_KEYS.root(), "DETAIL", id],
};

export const ODP_KEYS = {
    root: () => ["ODP"],
    list: (args?: any) => [ODP_KEYS.root(), "LIST", { ...(args || {}) }],
    detail: (id: string) => [ODP_KEYS.root(), "DETAIL", id],
};

