"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiInformationLine, RiShieldLine } from "@remixicon/react";
import { Check, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole } from "@/features/user-service/api/roles";
import {
  usePermissions,
} from "@/features/user-service/api/permissions";
import {
  createAccessPolicy,
  useAccessPolicies,
  useCreateAccessPolicy,
} from "@/features/user-service/api/access-policies";
import type { Permission } from "@/features/user-service/types";
import { useRoleStore } from "../../store/role";

type Effect = "allow" | "deny";

function toSnakeCase(val: string) {
  return val
    .trim()
    .replace(/[\s\-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function errMessage(err: unknown, fallback: string) {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    fallback
  );
}

export function RoleDialog() {
  const { t } = useTranslation();
  const { roleDialogOpen, closeRoleDialog, form, selectedRole } = useRoleStore();
  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [draftEffects, setDraftEffects] = useState<Record<string, Effect>>({});
  const [creatingPolicies, setCreatingPolicies] = useState(false);

  useEffect(() => {
    if (roleDialogOpen) {
      setName(selectedRole?.name ?? "");
      setDescription(selectedRole?.description ?? "");
      setDraftEffects({});
    }
  }, [roleDialogOpen, selectedRole]);

  const { mutateAsync: createRoleAsync, isPending: isCreatingRole } = useCreateRole();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t("administration.roles.roleNameRequired"));
      return;
    }
    try {
      const resp = await createRoleAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      const newRoleId = resp.data?.id;
      const drafts = Object.entries(draftEffects);

      if (newRoleId && drafts.length > 0) {
        setCreatingPolicies(true);
        let failed = 0;
        for (const [permission_id, effect] of drafts) {
          try {
            await createAccessPolicy({ role_id: newRoleId, permission_id, effect });
          } catch {
            failed += 1;
          }
        }
        setCreatingPolicies(false);
        if (failed > 0) {
          toast.warning(
            `${t("administration.roles.roleCreated")}. ${drafts.length - failed}/${drafts.length} permissions assigned.`,
          );
        } else {
          toast.success(t("administration.roles.roleCreated"));
        }
      } else {
        toast.success(t("administration.roles.roleCreated"));
      }
      closeRoleDialog();
    } catch (err) {
      toast.error(errMessage(err, t("administration.roles.failedToCreate")));
    }
  };

  const busy = isCreatingRole || creatingPolicies;

  return (
    <Dialog open={roleDialogOpen} onOpenChange={(open) => !open && !busy && closeRoleDialog()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="text-xl font-semibold">
            {isNewMode ? t("administration.roles.addNewRoleTitle") : isEditMode ? t("administration.roles.editRoleTitle") : t("administration.roles.roleDetailsTitle")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">{t("administration.roles.generalInformation")}</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-xs font-medium text-muted-foreground">
                  {t("administration.roles.roleNameLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="roleName"
                  placeholder={t("administration.roles.roleNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDetailMode || !isNewMode || busy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-xs font-medium text-muted-foreground">
                  {t("administration.roles.descriptionLabel")}
                </Label>
                <Textarea
                  id="roleDescription"
                  placeholder={t("administration.roles.descriptionPlaceholder")}
                  className="min-h-[72px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isDetailMode || !isNewMode || busy}
                />
              </div>
            </section>

            {isNewMode ? (
              <DraftPoliciesPicker
                effects={draftEffects}
                onChange={setDraftEffects}
                disabled={busy}
              />
            ) : selectedRole ? (
              <AccessPoliciesPicker roleId={selectedRole.id} readOnly={isDetailMode} />
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={closeRoleDialog} disabled={busy}>
            {isDetailMode ? t("administration.roles.close") : t("administration.roles.cancel")}
          </Button>
          {isNewMode && (
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={busy}
              className="font-semibold"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {creatingPolicies ? t("administration.roles.assigningPermissions") : t("administration.roles.createRole")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionsListUI({
  permissions,
  isLoading,
  title,
  assignedCount,
  effectOf,
  onSet,
  disabled,
  pendingKey,
  footerNote,
}: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  permissions: Permission[];
  isLoading: boolean;
  title: string;
  assignedCount: number;
  effectOf: (permId: string) => Effect | undefined;
  onSet?: (permId: string, effect: Effect) => void;
  disabled?: boolean;
  pendingKey?: string | null;
  footerNote?: string;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return permissions;
    const q = search.toLowerCase();
    return permissions.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.resource?.toLowerCase().includes(q) ||
        p.action?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [permissions, search]);

  const readOnly = !onSet;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-border/50">
        <RiShieldLine className="size-4 text-purple-500" />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-[11px] text-muted-foreground ml-auto">
          {assignedCount} {t("administration.roles.assigned")}
        </span>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder={t("administration.roles.searchPermissions")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-9 h-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin mr-2" /> {t("administration.roles.loadingPermissions")}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          {t("administration.roles.noPermissionsFound")}
        </div>
      ) : (
        <ul className="divide-y border rounded-md max-h-[320px] overflow-auto">
          {filtered.map((perm) => {
            const current = effectOf(perm.id);
            const allowKey = `${perm.id}:allow`;
            const denyKey = `${perm.id}:deny`;
            return (
              <li key={perm.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{perm.name}</p>
                  {(perm.resource || perm.action) && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {perm.resource}
                      {perm.action ? ` · ${perm.action}` : ""}
                    </p>
                  )}
                </div>
                {current && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      current === "allow"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {current === "allow" ? "ALLOW" : "DENY"}
                  </span>
                )}
                {!readOnly && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={current === "allow" ? "primary" : "outline"}
                      className="h-7 px-2 text-[11px]"
                      onClick={() => onSet!(perm.id, "allow")}
                      disabled={disabled || current === "allow"}
                    >
                      {pendingKey === allowKey ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Check className="size-3" />
                      )}
                      {t("administration.roles.allow")}
                    </Button>
                    <Button
                      size="sm"
                      variant={current === "deny" ? "destructive" : "outline"}
                      className="h-7 px-2 text-[11px]"
                      onClick={() => onSet!(perm.id, "deny")}
                      disabled={disabled || current === "deny"}
                    >
                      {pendingKey === denyKey ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <X className="size-3" />
                      )}
                      {t("administration.roles.deny")}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {footerNote && (
        <p className="text-[11px] text-muted-foreground">{footerNote}</p>
      )}
    </section>
  );
}

function DraftPoliciesPicker({
  effects,
  onChange,
  disabled,
}: {
  effects: Record<string, Effect>;
  onChange: (next: Record<string, Effect>) => void;
  disabled?: boolean;
}) {
  const { data: permsResp, isLoading } = usePermissions({ per_page: 500 });
  const permissions = permsResp?.data || [];
  const assignedCount = Object.keys(effects).length;

  const handleSet = (permId: string, effect: Effect) => {
    const next = { ...effects };
    if (next[permId] === effect) {
      delete next[permId];
    } else {
      next[permId] = effect;
    }
    onChange(next);
  };

  const { t } = useTranslation();

  return (
    <PermissionsListUI
      permissions={permissions}
      isLoading={isLoading}
      title={t("administration.roles.accessPermissions")}
      assignedCount={assignedCount}
      effectOf={(id) => effects[id]}
      onSet={handleSet}
      disabled={disabled}
      footerNote={t("administration.roles.draftFooterNote")}
    />
  );
}

function AccessPoliciesPicker({
  roleId,
  readOnly,
}: {
  roleId: string;
  readOnly: boolean;
}) {
  const { data: permsResp, isLoading: loadingPerms } = usePermissions({ per_page: 500 });
  const { data: policiesResp, isLoading: loadingPolicies } = useAccessPolicies({
    per_page: 500,
  });
  const { mutate: createPolicy, isPending: isSaving } = useCreateAccessPolicy();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const permissions = permsResp?.data || [];
  const policies = policiesResp?.data || [];

  const effectByPermId = useMemo(() => {
    const map = new Map<string, Effect>();
    for (const p of policies) {
      if (p.role?.id === roleId && p.permission?.id) {
        map.set(p.permission.id, p.effect);
      }
    }
    return map;
  }, [policies, roleId]);

  const setEffect = (permissionId: string, effect: Effect) => {
    const key = `${permissionId}:${effect}`;
    setPendingKey(key);
    createPolicy(
      { role_id: roleId, permission_id: permissionId, effect },
      {
        onSuccess: () => toast.success(`Permission ${effect}ed`),
        onError: (err: unknown) =>
          toast.error(errMessage(err, `Failed to ${effect} permission`)),
        onSettled: () => setPendingKey(null),
      },
    );
  };

  const { t } = useTranslation();

  return (
    <PermissionsListUI
      permissions={permissions}
      isLoading={loadingPerms || loadingPolicies}
      title={t("administration.roles.accessPermissions")}
      assignedCount={effectByPermId.size}
      effectOf={(id) => effectByPermId.get(id)}
      onSet={readOnly ? undefined : setEffect}
      disabled={isSaving}
      pendingKey={pendingKey}
      footerNote={
        readOnly
          ? undefined
          : t("administration.roles.policyFooterNote")
      }
    />
  );
}
