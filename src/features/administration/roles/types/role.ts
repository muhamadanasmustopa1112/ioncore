export type RoleFormMode = "new" | "edit" | "details" | null;

export interface RoleData {
  id: string;
  name: string;
  description: string;
  keyPermissions: string;
  isSystem: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
