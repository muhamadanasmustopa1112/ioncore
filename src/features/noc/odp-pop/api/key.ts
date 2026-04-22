export const POP_KEYS = {
    root: () => ["POP"],
    list: (args?: any) => [POP_KEYS.root(), "LIST", { ...(args || {}) }],
    detail: (id: string) => [POP_KEYS.root(), "DETAIL", id],
};
