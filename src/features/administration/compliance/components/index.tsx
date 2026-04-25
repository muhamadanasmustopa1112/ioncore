"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useComplianceUsersAccess } from "@/features/user-service/api/audit";

export function CompliancePage() {
  const [permInput, setPermInput] = useState("");
  const [permission, setPermission] = useState("");

  const { data: resp, isLoading, isFetching } = useComplianceUsersAccess({ permission, per_page: 100 });
  const users = Array.isArray(resp?.data) ? resp.data : [];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Compliance" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Compliance — Users Access
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Who has access to a given permission
          </p>
        </ToolbarHeading>
      </Toolbar>

      <Card className="mt-5">
        <CardHeader>
          <CardHeading className="py-4">
            <div className="flex items-end gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Permission name</Label>
                <div className="flex gap-2">
                  <Input
                    className="w-64"
                    placeholder="e.g. leads.create"
                    value={permInput}
                    onChange={(e) => setPermInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setPermission(permInput.trim())}
                  />
                  <Button
                    variant="primary"
                    onClick={() => setPermission(permInput.trim())}
                    disabled={!permInput.trim() || isFetching}
                  >
                    <Search className="size-4" />
                    Search
                  </Button>
                </div>
              </div>
              {permission && (
                <Badge variant="secondary" appearance="light" className="mb-0.5">
                  {users.length} user{users.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!permission && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                      Enter a permission name and click Search
                    </TableCell>
                  </TableRow>
                )}
                {permission && isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {permission && !isLoading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No users found with permission <span className="font-mono font-medium">{permission}</span>
                    </TableCell>
                  </TableRow>
                )}
                {users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.name ?? u.user_id}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email ?? "—"}</TableCell>
                    <TableCell>
                      {u.role_name ? (
                        <Badge variant="secondary" appearance="light" size="sm">{u.role_name}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{u.branch_id ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
      </Card>
    </div>
  );
}
