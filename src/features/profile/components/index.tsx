"use client";

import { useEffect, useState } from "react";
import {
  RiInformationLine,
  RiLockPasswordLine,
  RiShieldUserLine,
  RiHistoryLine,
  RiFileList3Line,
} from "@remixicon/react";
import { Check, Loader2, Monitor, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMyProfile,
  useUpdateMyProfile,
  useChangeMyPassword,
  useMySessions,
  useMyLoginHistories,
  useMyActivityLogs,
} from "@/features/user-service/api/auth";
import { useAuthStore } from "@/store/auth-store";

function initials(name: string) {
  return name.split(/\s+/).map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join("");
}

function PwRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
      {ok ? <Check className="size-3" /> : <X className="size-3" />}
      {label}
    </li>
  );
}

export function ProfilePage() {
  const { setProfile } = useAuthStore();
  const { data: meResp, isLoading } = useMyProfile();
  const me = meResp?.data;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [workingScope, setWorkingScope] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (me) {
      setName(me.name ?? "");
      setPhone(me.phone ?? "");
      setJobTitle(me.job_title ?? "");
      setUnitKerja(me.unit_kerja ?? "");
      setWorkingScope(me.working_scope ?? "");
    }
  }, [me]);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutate: changePassword, isPending: isChangingPw } = useChangeMyPassword();
  const { data: sessionsResp } = useMySessions({ per_page: 20 });
  const { data: loginHistoryResp, isLoading: loadingHistory } = useMyLoginHistories({ per_page: 50 });
  const { data: activityResp, isLoading: loadingActivity } = useMyActivityLogs({ per_page: 50 });

  const sessions = sessionsResp?.data ?? [];
  const loginHistory = loginHistoryResp?.data ?? [];
  const activityLogs = activityResp?.data ?? [];

  const pwRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const pwValid = pwRules.length && pwRules.uppercase && pwRules.special;

  const handleUpdateProfile = () => {
    updateProfile(
      {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        job_title: jobTitle.trim() || undefined,
        unit_kerja: unitKerja.trim() || undefined,
        working_scope: workingScope.trim() || undefined,
      },
      {
        onSuccess: (resp) => {
          toast.success("Profile updated");
          if (resp.data) setProfile(resp.data);
        },
        onError: (err: unknown) =>
          toast.error(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to update profile",
          ),
      },
    );
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) { toast.error("Both passwords are required"); return; }
    if (!pwValid) { toast.error("New password does not meet requirements"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    changePassword(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed");
          setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        },
        onError: (err: unknown) =>
          toast.error(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to change password",
          ),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-auto px-6 py-3">
      <PageBreadcrumb items={[{ title: "Profile" }]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">My Profile</ToolbarTitle>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — avatar card */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {initials(me?.name || me?.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-lg font-semibold">{me?.name || "—"}</p>
              <p className="text-sm text-muted-foreground">{me?.email}</p>
            </div>
            <Separator />
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {me?.is_active === false ? (
                  <Badge variant="destructive" appearance="light">Inactive</Badge>
                ) : me?.is_locked ? (
                  <Badge variant="warning" appearance="light">Locked</Badge>
                ) : (
                  <Badge variant="success" appearance="light">Active</Badge>
                )}
              </div>
              {me?.roles && me.roles.length > 0 && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Roles</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {me.roles.map((r) => (
                      <Badge key={r.id} variant="info" appearance="light" className="text-[10px]">{r.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {me?.branches && me.branches.length > 0 && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Branches</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {me.branches.map((b) => (
                      <Badge key={b.id} variant="secondary" appearance="light" className="text-[10px]">{b.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right — tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">
                <RiInformationLine className="size-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="security">
                <RiLockPasswordLine className="size-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="sessions">
                <RiShieldUserLine className="size-4" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="history">
                <RiHistoryLine className="size-4" />
                Login History
              </TabsTrigger>
              <TabsTrigger value="activity">
                <RiFileList3Line className="size-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="info">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                      <Input value={me?.email ?? ""} disabled className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 812 ..." />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Job Title</Label>
                      <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. NOC Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Unit / Department</Label>
                      <Input value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} placeholder="e.g. Network Operations" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Working Scope</Label>
                      <Input value={workingScope} onChange={(e) => setWorkingScope(e.target.value)} placeholder="e.g. National" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="primary" onClick={handleUpdateProfile} disabled={isUpdating} className="font-semibold">
                      {isUpdating && <Loader2 className="size-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security — change password */}
            <TabsContent value="security">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Current Password</Label>
                    <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
                    {newPassword && (
                      <ul className="mt-1.5 space-y-1">
                        <PwRule ok={pwRules.length} label="At least 8 characters" />
                        <PwRule ok={pwRules.uppercase} label="At least one uppercase letter" />
                        <PwRule ok={pwRules.special} label="At least one special character" />
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-[11px] text-destructive mt-1">Passwords do not match</p>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="primary" onClick={handleChangePassword} disabled={isChangingPw} className="font-semibold">
                      {isChangingPw && <Loader2 className="size-4 animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions */}
            <TabsContent value="sessions">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-muted-foreground font-normal">
                    {sessions.filter((s) => s.is_active).length} active session{sessions.filter((s) => s.is_active).length !== 1 ? "s" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No sessions found.</p>
                  ) : (
                    <ul className="divide-y">
                      {sessions.map((s) => (
                        <li key={s.id} className="flex items-start gap-3 py-3">
                          <Monitor className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1 text-sm">
                            <p className="font-medium truncate">{s.user_agent || "Unknown device"}</p>
                            <p className="text-[11px] text-muted-foreground">
                              IP: {s.ip_address || "—"}
                              {s.created_at && <> · Started {format(new Date(s.created_at), "dd MMM yyyy, HH:mm")}</>}
                            </p>
                          </div>
                          {s.is_active ? (
                            <Badge variant="success" appearance="light" className="text-[10px] shrink-0">Active</Badge>
                          ) : (
                            <Badge variant="secondary" appearance="light" className="text-[10px] shrink-0">Ended</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login History */}
            <TabsContent value="history">
              <Card>
                <CardContent className="pt-4">
                  {loadingHistory ? (
                    <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
                  ) : loginHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No login history found.</p>
                  ) : (
                    <ul className="divide-y">
                      {loginHistory.map((h) => (
                        <li key={h.id} className="flex items-start gap-3 py-3">
                          <div className="min-w-0 flex-1 text-sm">
                            <p className="text-[11px] text-muted-foreground">
                              IP: {h.ip_address || "—"}
                              {h.created_at && <> · {format(new Date(h.created_at), "dd MMM yyyy, HH:mm")}</>}
                            </p>
                            {h.user_agent && (
                              <p className="text-[11px] text-muted-foreground truncate">{h.user_agent}</p>
                            )}
                            {h.reason && <p className="text-[11px] text-destructive">{h.reason}</p>}
                          </div>
                          {h.success ? (
                            <Badge variant="success" appearance="light" className="text-[10px] shrink-0">Success</Badge>
                          ) : (
                            <Badge variant="destructive" appearance="light" className="text-[10px] shrink-0">Failed</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Log */}
            <TabsContent value="activity">
              <Card>
                <CardContent className="pt-4">
                  {loadingActivity ? (
                    <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
                  ) : activityLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No activity found.</p>
                  ) : (
                    <ul className="divide-y">
                      {activityLogs.map((a) => (
                        <li key={a.id} className="flex items-start gap-3 py-3">
                          <div className="min-w-0 flex-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{a.action || "—"}</span>
                              {a.resource && (
                                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                  {a.resource}{a.resource_id ? `:${a.resource_id.slice(0, 8)}` : ""}
                                </span>
                              )}
                              {a.is_suspicious && (
                                <Badge variant="warning" appearance="light" className="text-[10px]">Suspicious</Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {a.category && <>{a.category} · </>}
                              IP: {a.ip_address || "—"}
                              {a.created_at && <> · {format(new Date(a.created_at), "dd MMM yyyy, HH:mm")}</>}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
