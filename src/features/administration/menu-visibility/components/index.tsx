"use client";

import { useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardToolbar,
} from "@/components/ui/card";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

const ROLES = ["super_admin", "admin", "noc", "sales", "technician", "finance", "cs_agent"];

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", group: "General" },
  { id: "crm_sales", label: "CRM & Sales", group: "General" },
  { id: "network_orchestration", label: "Network & Orchestration", group: "Infrastructure" },
  { id: "technician_field", label: "Technician & Field", group: "Infrastructure" },
  { id: "warehouse_asset", label: "Warehouse & Asset", group: "Infrastructure" },
  { id: "billing_finance", label: "Billing & Finance", group: "Finance & Support" },
  { id: "customer_service", label: "Customer Service", group: "Finance & Support" },
  { id: "operations", label: "Operations", group: "Strategic" },
  { id: "enterprise_system", label: "Enterprise System", group: "Strategic" },
  { id: "intelligence_center", label: "Intelligence Center", group: "Strategic" },
  { id: "war_room", label: "War Room", group: "Strategic" },
  { id: "administration_branch", label: "Branch", group: "Administration" },
  { id: "administration_users", label: "Users & Roles", group: "Administration" },
  { id: "administration_schema", label: "Schema Builder", group: "Administration" },
  { id: "administration_checklist", label: "Checklist", group: "Administration" },
  { id: "administration_platform", label: "Platform Config", group: "Administration" },
  { id: "administration_audit", label: "Audit Log", group: "Administration" },
];

const DEFAULT_VISIBILITY: Record<string, Record<string, boolean>> = Object.fromEntries(
  MENU_ITEMS.map((item) => [
    item.id,
    Object.fromEntries(
      ROLES.map((role) => [
        role,
        role === "super_admin" || role === "admin"
          ? true
          : !["administration_platform", "administration_schema"].includes(item.id),
      ]),
    ),
  ]),
);

const GROUPS = Array.from(new Set(MENU_ITEMS.map((m) => m.group)));

export function MenuVisibilityPage() {
  const [visibility, setVisibility] = useState<Record<string, Record<string, boolean>>>(
    DEFAULT_VISIBILITY,
  );
  const [saved, setSaved] = useState(false);

  const toggle = (menuId: string, role: string) => {
    setVisibility((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], [role]: !prev[menuId][role] },
    }));
    setSaved(false);
  };

  const toggleAll = (menuId: string, value: boolean) => {
    setVisibility((prev) => ({
      ...prev,
      [menuId]: Object.fromEntries(ROLES.map((r) => [r, value])),
    }));
    setSaved(false);
  };

  const reset = () => {
    setVisibility(DEFAULT_VISIBILITY);
    setSaved(false);
  };

  const handleSave = () => {
    // Persist to localStorage until backend is available
    localStorage.setItem("ion_menu_visibility", JSON.stringify(visibility));
    setSaved(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Menu Visibility" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Menu Visibility Manager
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Control which menu items are visible per role
          </p>
        </ToolbarHeading>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" /> Reset
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </div>
      </Toolbar>

      <div className="mt-5 space-y-6">
        {GROUPS.map((group) => {
          const items = MENU_ITEMS.filter((m) => m.group === group);
          return (
            <Card key={group}>
              <CardHeader>
                <CardHeading>
                  <span className="text-sm font-semibold">{group}</span>
                  <Badge variant="secondary" appearance="light" size="sm">
                    {items.length} items
                  </Badge>
                </CardHeading>
                <CardToolbar />
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground w-48">
                          Menu Item
                        </th>
                        {ROLES.map((role) => (
                          <th
                            key={role}
                            className="px-3 py-2 font-medium text-muted-foreground text-center capitalize min-w-[90px]"
                          >
                            {role.replace(/_/g, " ")}
                          </th>
                        ))}
                        <th className="px-3 py-2 font-medium text-muted-foreground text-center w-20">
                          All
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item) => {
                        const allOn = ROLES.every((r) => visibility[item.id]?.[r]);
                        const allOff = ROLES.every((r) => !visibility[item.id]?.[r]);
                        return (
                          <tr key={item.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              {allOff ? (
                                <EyeOff className="size-3.5 text-muted-foreground" />
                              ) : (
                                <Eye className="size-3.5 text-primary" />
                              )}
                              {item.label}
                            </td>
                            {ROLES.map((role) => (
                              <td key={role} className="px-3 py-3 text-center">
                                <Switch
                                  checked={visibility[item.id]?.[role] ?? false}
                                  onCheckedChange={() => toggle(item.id, role)}
                                />
                              </td>
                            ))}
                            <td className="px-3 py-3 text-center">
                              <Switch
                                checked={allOn}
                                onCheckedChange={(v) => toggleAll(item.id, v)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
